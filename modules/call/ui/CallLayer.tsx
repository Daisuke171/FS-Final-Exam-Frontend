"use client";

import { useBoundCall } from "../hooks/useWebRTCCall.bound";
import IncomingCallToast from "../ui/IncomingCallToast";
import CallTray from "../ui/CallTray";

export default function CallLayer({ currentUserId }: { currentUserId?: string }) {
  useBoundCall(currentUserId ?? "");

  return (
    <>
      <IncomingCallToast />
      <CallTray />
    </>
  );
}
