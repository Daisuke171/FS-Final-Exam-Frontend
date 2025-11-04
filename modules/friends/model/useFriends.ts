"use client";

import { useQuery, useMutation, useApolloClient  } from "@apollo/client/react";
import { useRef, useCallback, useMemo } from "react";
import type {
  FriendPeer,
  CreateFriendInviteInputByUsername,
  CreateFriendInviteInput,
  FriendPayload,
  RequestFriendByUsernameInput,
} from "./types";
import {
  FRIEND_PEERS_OF_USER,
  FRIEND_BASIC, // query: getFriendById(id:)
} from "../api/friend.queries";
import {
  CREATE_FRIEND_INVITE_BY_USERNAME,
  CREATE_FRIEND_INVITE,
  REQUEST_FRIEND_BY_USERNAME,
  ACCEPT_INVITE_FRIEND,
  UPDATE_FRIEND_STATUS,
} from "../api/friend.mutation";

/* ---------------- Friends lists ---------------- */

export function useFriends(currentUserId: string) {
  const { data, loading, refetch, error } = useQuery<{ friendPeersOfUser: FriendPeer[] }>(
    FRIEND_PEERS_OF_USER,
    { variables: { userId: currentUserId } }
  );
  return {
    list: data?.friendPeersOfUser ?? [],
    loading,
    refetch,
    error,
  };
}

export function useFriendsPendings(currentUserId: string) {
  const { data, loading, refetch, error } = useQuery<{ friendPeersOfUser: FriendPeer[] }>(
    FRIEND_PEERS_OF_USER,
    { variables: { userId: currentUserId } }
  );
  const friendsPendings = data?.friendPeersOfUser?.filter((f) => f.status === "PENDING") ?? [];
  return { list: friendsPendings, loading, refetch, error };
}

/* ---------------- Invite flows ---------------- */

export function useCreateLink() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { createFriendInvite: string },
    { input: { inviterId: string; ttlHours?: number } }
  >(CREATE_FRIEND_INVITE);

  return {
    create: (input: CreateFriendInviteInput) => mutate({ variables: { input: input.toDTO() } }),
    url: data?.createFriendInvite ?? "",
    loading,
    error,
    reset,
  };
}

export function useCreateInviteByUsername() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { createFriendInviteByUsername: string | boolean },
    { input: { inviterId: string; targetUsername: string } }
  >(CREATE_FRIEND_INVITE_BY_USERNAME);

  return {
    send: (input: CreateFriendInviteInputByUsername) => mutate({ variables: { input: input.toDTO() } }),
    result: data?.createFriendInviteByUsername ?? null,
    loading,
    error,
    reset,
  };
}

export function useRequestFriendByUsername() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { requestFriendByUsername: FriendPayload },
    { input: RequestFriendByUsernameInput }
  >(REQUEST_FRIEND_BY_USERNAME);

  return {
    requestByUsername: (input: RequestFriendByUsernameInput) => mutate({ variables: { input } }),
    friend: data?.requestFriendByUsername ?? null,
    loading,
    error,
    reset,
  };
}

export function useAcceptInviteFriend() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { acceptFriendInvite: FriendPayload },
    { input: { receiverId: string; token: string } }
  >(ACCEPT_INVITE_FRIEND);

  return {
    accept: (receiverId: string, token: string) => mutate({ variables: { input: { receiverId, token } } }),
    friend: data?.acceptFriendInvite ?? null,
    loading,
    error,
    reset,
  };
}

export function useAcceptFriend() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { updateFriendStatus: FriendPayload },
    { input: { id: string; status: string } }
  >(UPDATE_FRIEND_STATUS);

  return {
    accept: (id: string, status: string = "ACCEPTED") => mutate({ variables: { input: { id, status } } }),
    friend: data?.updateFriendStatus ?? null,
    loading,
    error,
    reset,
  };
}

/* ---------------- Friend lookup (for calls) ---------------- */

export type FriendLite = {
  id: string;
  nickname: string;
  skin?: string | null; // url de imagen o null
};

export function useFriendLookup() {
  const client = useApolloClient();
  const cacheRef = useRef(new Map<string, FriendLite>());

  const get = useCallback(
    async (id: string): Promise<FriendLite | null> => {
      if (!id) return null;

      const hit = cacheRef.current.get(id);
      if (hit) return hit;

      const { data } = await client.query({
        query: FRIEND_BASIC,
        variables: { id },
        fetchPolicy: "cache-first",
      });

      const user = (data as any)?.getFriendById; // coincide con tu query GetFriendById
      if (!user) return null;

      const friend: FriendLite = {
        id: user.id,
        nickname: user.nickname ?? "Usuario",
        skin: user.activeSkin?.img ?? null,
      };

      cacheRef.current.set(id, friend);
      return friend;
    },
    [client]
  );

  const set = useCallback((f: FriendLite) => {
    if (f?.id) cacheRef.current.set(f.id, f);
  }, []);

  return useMemo(() => ({ get, set }), [get, set]);
}
