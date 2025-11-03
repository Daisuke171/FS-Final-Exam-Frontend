"use client";
import Avatar from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import type { FriendPeer } from "../model/types";
import { usePresenceStore } from "../model/presence.store";
import {useHandleEvents} from "../hooks/useHandleEvents";

interface FriendCardProps {
	friend: FriendPeer;
	currentUserId: string;
}

export default function FriendCard({ friend, currentUserId }: FriendCardProps) {
	const chatId = friend.chatId;
	 const { unread } = useHandleEvents(chatId, currentUserId);
	const isOnline = usePresenceStore((s) => s.isOnline(friend.peer.id));


	return (
		<div
			className="flex items-center justify-between px-3 py-2 rounded-xl 
                    bg-white/5 border border-cyan-300/30 hover:bg-white/10 transition"
		>
			<div className="flex items-center gap-3">
				<Avatar
					src={friend.peer.activeSkin?.img || "/default-avatar.png"}
					alt={friend.peer.nickname}
					size={10}
				/>
				<div className="font-semibold">{friend.peer.nickname}</div>
			</div>

			<div className="flex items-center gap-2">
				{unread > 0 && (
					<Badge type="message">
						+{unread}
					</Badge>
				)}

				<Badge color={isOnline ? "green" : "pink"} type="presence">
					{isOnline ? "Online" : "Offline"}
				</Badge>
			</div>
		</div>
	);
}
