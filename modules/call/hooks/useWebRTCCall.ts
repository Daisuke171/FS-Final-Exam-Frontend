"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useMutation } from "@apollo/client/react";
import { 
  START_CALL, 
  ANSWER_CALL, 
  REJECT_CALL, 
  END_CALL } from "../api/call.queries";
import { getCallSocket } from "../service/call.socket";

const ICE_SERVERS: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

type CallUIState = "IDLE" | "RINGING" | "IN_CALL" | "ENDED" | "REJECTED";

export function useWebRTCCall(currentUserId: string) {
  const [doStartCall] = useMutation(START_CALL);
  const [doAnswerCall] = useMutation(ANSWER_CALL);
  const [doRejectCall] = useMutation(REJECT_CALL);
  const [doEndCall] = useMutation(END_CALL);

  const socketRef = useRef<ReturnType<typeof getCallSocket> | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [uiState, setUIState] = useState<CallUIState>("IDLE");
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [ringer, setRinger] = useState<{ callId: string; from: string; sdpOffer?: RTCSessionDescriptionInit } | null>(null);

  const ensurePC = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.ontrack = (e) => setRemoteStream(e.streams[0] ?? null);
    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current && activeCallId) {
        socketRef.current.emit("signal:ice", { roomId: activeCallId, candidate: e.candidate });
      }
    };
    pcRef.current = pc;
    return pc;
  }, [activeCallId]);

  const startLocalMedia = useCallback(async (withVideo = true) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: withVideo ? { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 30 } } : false,
    });
    localStreamRef.current = stream;
    const pc = ensurePC();
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    return stream;
  }, [ensurePC]);

  useEffect(() => {
    const s = getCallSocket(currentUserId);
    socketRef.current = s;

    s.on("signal:offer", async ({ sdp }) => {
      const pc = ensurePC();
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit("signal:answer", { toSocketId: s.id, sdp: pc.localDescription });
    });

    s.on("signal:answer", async ({ sdp }) => {
      const pc = ensurePC();
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    s.on("signal:ice", async ({ candidate }) => {
      try {
        const pc = ensurePC();
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch { }
    });

    s.on("call:ring", ({ callId, from, sdpOffer }) => {
      setRinger({ callId, from, sdpOffer });
      setActiveCallId(callId);
      setUIState("RINGING");
      s.emit("join", callId);
    });

    s.on("call:accepted", async ({ callId, sdpAnswer }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
      setUIState("IN_CALL");
      s.emit("join", callId);
    });

    s.on("call:rejected", () => { setUIState("REJECTED"); cleanupPC(); });
    s.on("call:ended", () => { setUIState("ENDED"); cleanupPC(); });

    return () => { s.offAny(); s.disconnect(); cleanupPC(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, ensurePC]);

  const cleanupPC = useCallback(() => {
    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    setRemoteStream(null);
    setActiveCallId(null);
    setRinger(null);
  }, []);

  // 🔒 Acciones memoizadas
  const startCall = useCallback(async (calleeId: string) => {
    const pc = ensurePC();
    if (!localStreamRef.current) await startLocalMedia(true);
    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);
    const { data } = await doStartCall({ variables: { calleeId, sdpOffer: JSON.stringify(offer) } });
    const callId = data?.startCall?.id as string | undefined;
    if (callId) {
      setActiveCallId(callId);
      socketRef.current?.emit("join", callId);
    }
    setUIState("RINGING");
    return callId;
  }, [doStartCall, ensurePC, startLocalMedia]);

  const acceptCall = useCallback(async () => {
    if (!ringer) return;
    const pc = ensurePC();
    if (!localStreamRef.current) await startLocalMedia(true);
    await pc.setRemoteDescription(new RTCSessionDescription(ringer.sdpOffer!));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await doAnswerCall({ variables: { callId: ringer.callId, sdpAnswer: JSON.stringify(answer) } });
    socketRef.current?.emit("join", ringer.callId);
    setUIState("IN_CALL");
  }, [ringer, doAnswerCall, ensurePC, startLocalMedia]);

  const rejectCall = useCallback(async () => {
    if (!activeCallId) return;
    await doRejectCall({ variables: { callId: activeCallId } });
    setUIState("REJECTED");
    cleanupPC();
  }, [activeCallId, doRejectCall, cleanupPC]);

  const endCall = useCallback(async () => {
    if (!activeCallId) return;
    await doEndCall({ variables: { callId: activeCallId } });
    setUIState("ENDED");
    cleanupPC();
  }, [activeCallId, doEndCall, cleanupPC]);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
  }, []);

  const shareScreen = useCallback(async () => {
    const disp: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
    const vTrack = disp.getVideoTracks()[0];
    const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
    if (sender && vTrack) await sender.replaceTrack(vTrack);
    return disp;
  }, []);

  return {
    uiState, activeCallId, ringer,
    localStream: localStreamRef.current, remoteStream,
    startLocalMedia, startCall, acceptCall, rejectCall, endCall,
    toggleMute, toggleCamera, shareScreen,
  };
}