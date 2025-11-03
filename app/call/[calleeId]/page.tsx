"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useWebRTCCall } from "@modules/call/hooks/useWebRTCCall";
import { session } from "next-auth/react";

export default function CallPage() {
  const { data: sessionData } = session();
  console.log(sessionData, "session data");
  const { calleeId } = useParams<{ calleeId: string }>();
  const currentUserId = sessionData?.user?.id as string;
  console.log(currentUserId, "user id desde el call");
  
  const {
    uiState, ringer, localStream, remoteStream,
    startLocalMedia, startCall, acceptCall, rejectCall, endCall,
    toggleMute, toggleCamera, shareScreen,
  } = useWebRTCCall(currentUserId);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
      localRef.current.muted = true;
      localRef.current.play().catch(() => {});
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
      remoteRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <video ref={localRef} autoPlay playsInline className="w-full rounded-xl bg-black/70" />
        <video ref={remoteRef} autoPlay playsInline className="w-full rounded-xl bg-black/70" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => startLocalMedia(true)}>Permitir mic/cam</button>
        <button onClick={() => startCall(calleeId)}>Llamar</button>
        <button onClick={acceptCall} disabled={!ringer}>Aceptar</button>
        <button onClick={rejectCall} disabled={!ringer}>Rechazar</button>
        <button onClick={endCall}>Cortar</button>
        <button onClick={toggleMute}>Mute</button>
        <button onClick={toggleCamera}>Cam on/off</button>
        <button onClick={shareScreen}>Compartir pantalla</button>
      </div>

      <div>Estado: {uiState}</div>
    </div>
  );
}
