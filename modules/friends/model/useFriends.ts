"use client";

import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { FriendPeer, CreateFriendInviteInputByUsername, CreateFriendInviteInput, FriendPayload } from "./types";
import {                  
  FRIEND_PEERS_OF_USER,
  CREATE_FRIEND_INVITE_BY_USERNAME,
  CREATE_FRIEND_INVITE,
  REQUEST_FRIEND_BY_USERNAME,
  ACCEPT_INVITE_FRIEND
} from "@shared/lib/graphql/queries/friend.gql";


export function useFriends(currentUserId: string) {  
  const { data, loading, refetch, error } = useQuery<{ friendPeersOfUser: FriendPeer[] }>(FRIEND_PEERS_OF_USER, {
    variables: { userId: currentUserId }
  });
  
  return {
    list: data?.friendPeersOfUser ?? [],
    loading,
    refetch,
    error,
  };
}

/** Crea link y devuelve la URL como string */
export function useCreateLink() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { createFriendInvite: string },                            
    { input: { inviterId: string; ttlHours?: number } }
  >(CREATE_FRIEND_INVITE);

  return {
    create: (input: CreateFriendInviteInput) =>
      mutate({ variables: { input: input.toDTO() } }),
    url: data?.createFriendInvite ?? "",                        
    loading,
    error,
    reset,
  };
}

/** Invita por username */
export function useCreateInviteByUsername() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { createFriendInviteByUsername: string | boolean },         
    { input: { inviterId: string; targetUsername: string } }
  >(CREATE_FRIEND_INVITE_BY_USERNAME);

  return {
    send: (input: CreateFriendInviteInputByUsername) =>
      mutate({ variables: { input: input.toDTO() } }),
    result: data?.createFriendInviteByUsername ?? null,
    loading,
    error,
    reset,
  };
}

/** Solicitud de amistad por username  */
export function useRequestFriendByUsername() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { requestFriendByUsername: FriendPayload },
    { input: { requesterId: string; username: string } }
  >(REQUEST_FRIEND_BY_USERNAME);

  return {
    requestByUsername: (requesterId: string, username: string) =>
      mutate({ variables: { input: { requesterId, username } } }),
    friend: data?.requestFriendByUsername ?? null,
    loading,
    error,
    reset,
  };
}

/** Aceptar invitación de amistad */
export function useAcceptInviteFriend() {
  const [mutate, { data, loading, error, reset }] = useMutation<
    { acceptFriendInvite: FriendPayload },
    { input: { receiverId: string; token: string } }
  >(ACCEPT_INVITE_FRIEND);

  return {
    accept: (receiverId: string, token: string) =>
      mutate({ variables: { input: { receiverId, token } } }),
    friend: data?.acceptFriendInvite ?? null,
    loading,
    error,
    reset,
  };
}