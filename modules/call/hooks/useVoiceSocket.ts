'use client';

import { useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const TARGET_SAMPLE_RATE = 16000;
const CHANNELS = 1;
const CHUNK_MS = 20;
const SAMPLES_PER_CHUNK = (TARGET_SAMPLE_RATE * CHUNK_MS) / 1000; // 320 @16k

export function useVoiceSocket(url = 'http://localhost:3010/call') {
  const socketRef = useRef<Socket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micNodeRef = useRef<AudioWorkletNode | null>(null); 
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const [connected, setConnected] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [peers, setPeers] = useState<string[]>([]);
  const [muted, _setMuted] = useState(true);        
  const mutedRef = useRef<boolean>(true);

  const setMuted = useCallback((m: boolean) => {
    mutedRef.current = m;
    _setMuted(m);
  }, []);

  const playbackQueueRef = useRef<Int16Array[]>([]);
  const playbackTimerRef = useRef<number | null>(null);

  const startPlayback = () => {
    if (playbackTimerRef.current) return;
    const audioCtx =
      audioCtxRef.current ||
      new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: TARGET_SAMPLE_RATE,
      });
    audioCtxRef.current = audioCtx;

    playbackTimerRef.current = window.setInterval(() => {
      const q = playbackQueueRef.current;
      if (q.length === 0) return;
      const int16 = q.shift()!;
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 0x7fff;

      const buf = audioCtx.createBuffer(CHANNELS, float32.length, TARGET_SAMPLE_RATE);
      buf.getChannelData(0).set(float32);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      src.start();
    }, CHUNK_MS);
  };

  const stopPlayback = () => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  };

  // ---- Utils ----
  const downsampleFloat32ToInt16 = (
    buffer: Float32Array,
    inRate: number,
    outRate: number
  ): Int16Array => {
    if (inRate === outRate) {
      const out = new Int16Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        let s = Math.max(-1, Math.min(1, buffer[i]));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      return out;
    }
    const ratio = inRate / outRate;
    const newLen = Math.round(buffer.length / ratio);
    const out = new Int16Array(newLen);
    for (let i = 0; i < newLen; i++) {
      const idx = i * ratio;
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, buffer.length - 1);
      const t = idx - i0;
      const sample = buffer[i0] * (1 - t) + buffer[i1] * t;
      let s = Math.max(-1, Math.min(1, sample));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  };

  // ---- Socket ----
  const connect = useCallback(() => {
    if (socketRef.current) return;
    const socket = io(url, { withCredentials: true, transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => {
      setConnected(false);
      setJoinedRoom(null);
      setPeers([]);
      stopPlayback();
    });

    socket.on('joined', ({ room, user }) => {
      setJoinedRoom(room);
      console.log('🔔 joined', { room, user });
    });

    socket.on('peer:joined', ({ user }) =>
      setPeers((p) => [...new Set([...p, user])])
    );
    socket.on('peer:left', ({ user }) =>
      setPeers((p) => p.filter((u) => u !== user))
    );

    socket.on('peer:mute', ({ user, muted }) => {
      console.log('peer mute status', user, muted);
    });

    // PCM entrante
    socket.on('audio', (arrbuf: ArrayBuffer) => {
      const int16 = new Int16Array(arrbuf);
      playbackQueueRef.current.push(int16);
      startPlayback();
    });
  }, [url]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    stopCapture();
    stopPlayback();
  }, []);

  const join = useCallback((room: string, user?: string) => {
    socketRef.current?.emit('join', { room, user });
  }, []);

  // ---- Captura con AudioWorklet (Chrome-friendly) ----
  async function startCapture({
    echoCancellation = true,
    noiseSuppression = true,
    autoGainControl = true,
  } = {}) {
    if (micStreamRef.current) return; // ya capturando

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: { ideal: 1 },
        sampleRate: { ideal: 48000 },
        echoCancellation,
        noiseSuppression,
        autoGainControl,
      } as any,
      video: false,
    });
    micStreamRef.current = stream;

    const ac =
      audioCtxRef.current ||
      new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ac;

    if (ac.state === 'suspended') {
      try { await ac.resume(); } catch (e) {
        console.warn('AudioContext resume error:', e);
      }
    }

    // Cargar módulo del worklet
    await ac.audioWorklet.addModule('/worklets/mic-processor.js');

    const source = ac.createMediaStreamSource(stream);
    sourceRef.current = source;

    const micNode = new AudioWorkletNode(ac, 'mic-processor', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
    });
    micNodeRef.current = micNode;

    source.connect(micNode);
    
    const workRate = ac.sampleRate; // normalmente 48000
    const samplesNeeded = Math.round(
      SAMPLES_PER_CHUNK * (workRate / TARGET_SAMPLE_RATE)
    );
    let acc = new Float32Array(0);

    micNode.port.onmessage = (ev: MessageEvent) => {
      if (ev.data?.type !== 'frame') return;
      if (mutedRef.current) return; // respeta mute

      const frameF32 = new Float32Array(ev.data.data);
      // acumular y downsamplear a 16k
      const tmp = new Float32Array(acc.length + frameF32.length);
      tmp.set(acc, 0);
      tmp.set(frameF32, acc.length);
      acc = tmp;

      while (acc.length >= samplesNeeded) {
        const slice = acc.subarray(0, samplesNeeded);
        acc = acc.subarray(samplesNeeded);
        const int16 = downsampleFloat32ToInt16(slice, workRate, TARGET_SAMPLE_RATE);
        socketRef.current?.emit('audio', int16.buffer);
      }
    };
  }

  function stopCapture() {
    if (micNodeRef.current) {
      try {
        micNodeRef.current.port?.close?.();
        micNodeRef.current.disconnect();
      } catch {}
      micNodeRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
  }

  return {
    connected,
    joinedRoom,
    peers,
    muted,
    connect,
    disconnect,
    join,
    startCapture,   // Toast: al activar mic
    stopCapture,
    setMuted,       // Toast: para toggle mute
  };
}
