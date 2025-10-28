"use client";
import type { FriendPeer } from "../model/types";
import FriendCard from "./FriendCard";

export default function FriendList({
  items,
  onSelect,
  currentUserId,
}: {
  items: FriendPeer[];
  onSelect: (friend: FriendPeer) => void;
  currentUserId: string;
}) {
 
  return (
    <div className="space-y-3">
      {(items ?? []).map((friend) => (
        <button
          key={friend.id}
          onClick={() => onSelect(friend)}
          className="w-full text-left"
        >
          <FriendCard friend={friend} currentUserId={currentUserId} />
        </button>
      ))}
    </div>
  );
}
