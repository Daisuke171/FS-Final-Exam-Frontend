"use client";
import { apolloClient } from "shared/lib/apollo-client";
import { FRIEND_PEERS_OF_USER } from "shared/lib/graphql/queries/friend.gql";
import type { Friend, FriendPeer } from "../model/types";
import FriendCard from "./FriendCard";

export default function FriendList({
  items,
  onSelect,
}: {
  items: FriendPeer[];
  onSelect: (friend: FriendPeer) => void;
}) {
 
  return (
    <div className="space-y-3">
      {(items ?? []).map((friend) => (
        <button
          key={friend.id}
          onClick={() => onSelect(friend)}
          className="w-full text-left"
        >
          <FriendCard friend={friend} />
        </button>
      ))}
    </div>
  );
}
