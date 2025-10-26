import { ApolloClient, gql } from "@apollo/client";

export const MY_FRIENDS = gql`
  query MyFriends($userId: ID!) {
    myFriends(userId: $userId) {
      id
      status
      active
      requesterId
      receiverId
      createdAt
      updatedAt
      requester { id nickname name lastname username }
      receiver  { id nickname name lastname username }
    }
  }
`;

type FriendEntity = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  active: boolean;
  requesterId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  requester?: { id: string; nickname: string; name?: string; lastname?: string, username?: string } | null;
  receiver?: { id: string; nickname: string; name?: string; lastname?: string , username?: string } | null;
};

/** Lee la lista cacheada (si existe) */
export function readMyFriendsCache(
  client: ApolloClient,
  userId: string
): FriendEntity[] | null {
  try {
    const data = client.readQuery<{ myFriends: FriendEntity[] }>({
      query: MY_FRIENDS,
      variables: { userId },
    });
    return data?.myFriends ?? null;
  } catch {
    return null;
  }
}

/** Upsert (agrega si no existe, si existe actualiza campos) */
export function upsertFriendInCache(
  client: ApolloClient,
  userId: string,
  friend: FriendEntity
) {
  const current = readMyFriendsCache(client, userId) ?? [];
  const idx = current.findIndex((f) => f.id === friend.id);
  const next = idx === -1 ? [friend, ...current] : current.toSpliced(idx, 1, { ...current[idx], ...friend });

  client.writeQuery({
    query: MY_FRIENDS,
    variables: { userId },
    data: { myFriends: next },
  });
}

/** Solo cambia status */
export function updateFriendStatusInCache(
  client: ApolloClient,
  userId: string,
  friendId: string,
  status: FriendEntity["status"]
) {
  const current = readMyFriendsCache(client, userId);
  if (!current) return;
  const idx = current.findIndex((f) => f.id === friendId);
  if (idx === -1) return;
  const next = current.toSpliced(idx, 1, { ...current[idx], status });
  client.writeQuery({ query: MY_FRIENDS, variables: { userId }, data: { myFriends: next } });
}

/** Toggle active */
export function toggleActiveInCache(
  client: ApolloClient,
  userId: string,
  friendId: string,
  active: boolean
) {
  const current = readMyFriendsCache(client, userId);
  if (!current) return;
  const idx = current.findIndex((f) => f.id === friendId);
  if (idx === -1) return;
  const next = current.toSpliced(idx, 1, { ...current[idx], active });
  client.writeQuery({ query: MY_FRIENDS, variables: { userId }, data: { myFriends: next } });
}

/** Remove */
export function removeFriendFromCache(
  client: ApolloClient,
  userId: string,
  friendId: string
) {
  const current = readMyFriendsCache(client, userId);
  if (!current) return;
  const next = current.filter((f) => f.id !== friendId);
  client.writeQuery({ query: MY_FRIENDS, variables: { userId }, data: { myFriends: next } });
}
