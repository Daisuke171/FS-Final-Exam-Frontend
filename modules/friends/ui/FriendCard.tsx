import Avatar from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import type { FriendPeer } from "../model/types";
import { usePresenceStore } from "../model/presence.store";
import { useUnreadStore } from "@/modules/chat/model/unread.store";
import { useGetMessages } from "@/modules/chat/hooks/useMessages";

interface FriendCardProps {
	friend: FriendPeer;
	currentUserId: string;
}

export default function FriendCard({ friend, currentUserId }: FriendCardProps) {
	const isOnline = usePresenceStore((s) => s.isOnline(friend.peer.id));

	const unread = useUnreadStore((s) => s.getCount(friend.chatId));



	console.log(isOnline, "isOnline");
	

	return (
		<div
			className="flex items-center justify-between px-3 py-2 rounded-xl 
                    bg-white/5 border border-cyan-300/30 hover:bg-white/10 transition"
		>
			<div className="flex items-center gap-3">
				<Avatar
					src={friend.peer.activeSkin?.img || "/avatars/derpy.svg"}
					alt={friend.peer.nickname}
					size={10}
				/>
				<div className="font-semibold">{friend.peer.nickname}</div>
			</div>

			<div className="flex items-center gap-2">
				{unread > 0 && (
					<Badge color="cyan" type="message">
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
