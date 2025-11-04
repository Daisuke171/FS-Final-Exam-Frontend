"use client";

import { useState, useMemo, useEffect } from "react";
import { Session } from "next-auth";
import FabMenu from "@shared/ui/FabMenu";
import { cn } from "@shared/lib/utils";
import { FriendList } from "@modules/friends";
import { ChatWindow } from "@modules/chat";
import type { FriendPeer } from "@modules/friends/model/types";
import { useFriends } from "@modules/friends/model/useFriends";
import { useFriendsWS } from "@modules/friends/model/useFriendsWS";
import { getFriendsSocket, authFriendsSocket } from "./services/friend.socket";
import GlobalLoader from "@/components/ui/loaders/GlobalLoader";
import FormTitle from "@/components/register/FormTitle";
import CallLauncher from "@modules/call/ui/CallLauncher";

interface FriendsPageProps {
  session: Session | null;
  userId: string | null;
}

export default function FriendsPage({ session, userId }: FriendsPageProps) {
  const { list, loading, refetch } = useFriends(userId ?? "");

  const [selected, setSelected] = useState<FriendPeer | null>(null);
  const handleCloseChat = () => setSelected(null);

  const listFriendsActives = useMemo(
    () =>
      (list ?? []).filter(
        (friend) => friend.active && friend.status === "ACCEPTED"
      ),
    [list]
  );

  useEffect(() => {
    if (!session || !userId) return;
    authFriendsSocket(userId);
    if (userId) getFriendsSocket().emit("presence:get", { userId });
  }, [userId]);

  //  ✅ Conectar WS sólo si hay userId
  useFriendsWS(userId, {
    onEvent: (e) => {
      console.log("friend:event", e);
      if (e.type === "friend:accepted") {
        refetch?.();
      }
    },
    onRefresh: () => refetch?.(),
  });

  if (!session || loading) {
    return <GlobalLoader />;
  }

  return (
    <main className="w-[90%] max-w-300 mx-auto px-4 pb-20 mt-16 md:pb-6 pt-8 relative">
      <section className="pb-4 flex items-center justify-center">
        <div className="absolute origin-top-right right-10 top-0 w-fit">
          <CallLauncher
            currentUser={{
              id: userId ?? "",
              nickname: session?.user?.name ?? "yo",
              skin: session?.user?.image ?? "",
            }}
          />
        </div>
        <FormTitle title="AMIGOS" />
      </section>

      <section className="grid gap-4 md:grid-cols-[280px_1fr_auto] px-4">
        <aside
          className={cn(
            selected
              ? "hidden md:block"
              : "block md:sticky md:top-20 self-start"
          )}
        >
          {!listFriendsActives.length && (
            <div className="grid place-items-center min-h-[40vh] rounded-2xl border border-dashed border-cyan-300/30 text-sm text-cyan-200/70 p-4 text-center md:hidden">
              <p>Agrega amigos para empezar a chatear</p>
            </div>
          )}
          <FriendList
            items={listFriendsActives}
            onSelect={(fp: FriendPeer) => setSelected(fp)}
            currentUserId={userId ?? ""}
          />
        </aside>

        <section className={cn(selected ? "block" : "hidden", "md:block")}>
          <ChatWindow
            currentUserId={userId}
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

          {!listFriendsActives.length && (
            <div className="hidden md:grid place-items-center min-h-[40vh] rounded-2xl border border-dashed border-cyan-300/30 text-sm text-cyan-200/70 p-4 text-center">
              <p>Agrega amigos para empezar a chatear</p>
            </div>
          )}

          {listFriendsActives.length > 0 && !selected && (
            <div className="hidden md:grid place-items-center min-h-[40vh] rounded-2xl border border-dashed border-cyan-300/30 text-sm text-cyan-200/70 p-4 text-center">
              <p>Seleccioná un amigo para iniciar el chat</p>
            </div>
          )}
        </section>

        <aside className="block">
          <FabMenu currentUserId={userId} />
        </aside>
      </section>
    </main>
  );
}
