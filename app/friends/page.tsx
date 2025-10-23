"use client";
import { useState } from "react";
import AppShell from "@shared/ui/layout/AppShell";
import BottomNav from "@shared/ui/layout/BottomNav";
import FabMenu from "@shared/ui/FabMenu";
import { cn } from "@shared/lib/utils";
import { FriendList } from "@modules/friends";
import { ChatWindow } from "@modules/chat";                      

import type { FriendPeer } from "@modules/friends/model/types";

import { useFriends } from "@modules/friends/model/useFriends";
import { useFriendsWS } from "@modules/friends/model/useFriendsWS";

export default function FriendsPage() {
	const userId = "8f9a8e8f-9fdb-412a-afd5-cd3b52d508ee";
	const { list, loading, refetch } = useFriends(userId);
	const [selected, setSelected] = useState<FriendPeer | null>(null);

	const handleCloseChat = () => setSelected(null);

	const listFriendsActives = list?.filter(
		(f) => f.active && f.status === "ACCEPTED"
	);

	useFriendsWS(userId, {
		onEvent: (e) => {
			console.log("friend:event", e);
			if (e.type === "friend:accepted") {
				refetch();
			}
		},
		onRefresh: () => refetch(),
	});

	if (loading) {
		return (
			<AppShell>
				<main className="max-w-7xl mx-auto px-4 pb-20 md:pb-6 pt-8">
					<div className="py-12 text-center">Loading...</div>
				</main>
			</AppShell>
		);
	}

	return (
		<AppShell>
			<main className="max-w-7xl mx-auto px-4 pb-20 md:pb-6 pt-8">
				<div className="pb-4 flex items-center justify-center">
					<h2 className="text-2xl font-light">AMIGOS</h2>
				</div>

				<div className="grid gap-4 md:grid-cols-[280px_1fr_auto]">
					<aside
						className={cn(
							selected
								? "hidden md:block"
								: "block md:sticky md:top-20 self-start"
						)}
					>
						<FriendList
							items={listFriendsActives ? listFriendsActives : []}
							onSelect={(fp: FriendPeer) => setSelected(fp)}
						/>
					</aside>
					<section
						className={cn(
							selected ? "block" : "hidden",
							"md:block"
						)}
					>
						<ChatWindow
							friend={
								selected
									? {
											id: selected.peer.id,
											nickname: selected.peer.nickname,
											skin: selected.peer.activeSkin?.img,
											chatId: selected.chatId,
									  }
									: undefined
							}
							visible={!!selected}
							onClose={handleCloseChat}
						/>
						{!list.length && (
							<div className="hidden md:grid place-items-center min-h-[40vh] rounded-2xl border border-dashed border-cyan-300/30 text-sm text-cyan-200/70 p-4 text-center">
								Aún no tienes amigos para chatear
							</div>
						)}
						{list.length > 0 && !selected && (
							<div className="hidden md:grid place-items-center min-h-[40vh] rounded-2xl border border-dashed border-cyan-300/30 text-sm text-cyan-200/70 p-4 text-center">
								Seleccioná un amigo para iniciar el chat
							</div>
						)}
					</section>
					<aside className="block">
						<FabMenu />
					</aside>
				</div>
				<BottomNav />
			</main>
		</AppShell>
	);
}
