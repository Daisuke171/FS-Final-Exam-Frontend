"use client";

import { useSubscription } from "@apollo/client/react";
import { MESSAGE_ADDED } from "../api/chat.subscritions";

export function useMessageAdded(chatId?: string) {
  useSubscription(MESSAGE_ADDED, {
    skip: !chatId,
    variables: { chatId }
  });
}