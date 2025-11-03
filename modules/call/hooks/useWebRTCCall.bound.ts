"use client";
import { useEffect } from "react";
import { useWebRTCCall } from "./useWebRTCCall";
import { useCallStore } from "../model/call.store";

export function useBoundCall(currentUserId: string) {
  const api = useWebRTCCall(currentUserId);
  const { setFromHook, setUi, setIncoming, show } = useCallStore();

  // ✅ solo cuando cambian referencias (memoizadas) de acciones
  useEffect(() => {
    setFromHook({
      startCall: api.startCall,
      acceptCall: api.acceptCall,
      rejectCall: api.rejectCall,
      endCall: api.endCall,
      toggleMute: api.toggleMute,
      toggleCamera: api.toggleCamera,
      shareScreen: api.shareScreen,
    });
  }, [
    setFromHook,
    api.startCall, api.acceptCall, api.rejectCall, api.endCall,
    api.toggleMute, api.toggleCamera, api.shareScreen,
  ]);

  // Esto está bien: refleja el estado actual en el store
  useEffect(() => { setUi(api.uiState); }, [api.uiState, setUi]);

  useEffect(() => {
    if (api.ringer) {
      setIncoming({
        callId: api.ringer.callId,
        from: api.ringer.from,
        sdpOffer: api.ringer.sdpOffer,
      });
    } else {
      setIncoming(null);
    }
  }, [api.ringer, setIncoming]);

  // opcional: cuando entra en IN_CALL mostrar tray si no está
  useEffect(() => {
    if (api.uiState === "IN_CALL" && api.activeCallId) {
      // show(...) si querés forzar el tray acá
    }
  }, [api.uiState, api.activeCallId, show]);

  return api;
}


/* "use client";
import { useEffect } from "react";
import { useWebRTCCall } from "./useWebRTCCall";
import { useCallStore } from "../model/call.store";

type ResolveFriend = (userId: string) => {
    id: string;
    nickname: string;
    avatar?: string
} | null;


export function useBoundCall(currentUserId: string, resolveFriend?: ResolveFriend) {
    const api = useWebRTCCall(currentUserId);
    const { setFromHook, setUi, setIncoming, show } = useCallStore();

    useEffect(() => {
        // exponer acciones/estado al store global
        setFromHook({
            startCall: api.startCall,
            acceptCall: api.acceptCall,
            rejectCall: api.rejectCall,
            endCall: api.endCall,
            toggleMute: api.toggleMute,
            toggleCamera: api.toggleCamera,
            shareScreen: api.shareScreen,
        });
    }, [api, setFromHook]);

    useEffect(() => { setUi(api.uiState); }, [api.uiState, setUi]);

    // cuando llegue ring en el hook, reflejalo globalmente
    useEffect(() => {
        if (api.ringer) {
            setIncoming({
                callId: api.ringer.callId,
                from: api.ringer.from,
                sdpOffer: api.ringer.sdpOffer,
            });
            // opcional: si querés mostrar el tray al tocar aceptar, lo hacemos en el botón
        } else {
            setIncoming(null);
        }
    }, [api.ringer, setIncoming]);

    // cuando entres efectivamente a IN_CALL, mostrá tray (si conocemos el amigo)
    useEffect(() => {
        if (api.uiState === "IN_CALL" && api.activeCallId) {
            const f = resolveFriend?.(api.ringer?.from ?? "") ?? null;
            if (f) show(api.activeCallId, f);
        }
        
    }, [api.uiState, api.activeCallId]);

    return api;
}
 */