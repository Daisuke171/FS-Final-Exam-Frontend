// components/FabMenu.tsx
"use client";

import { useEffect, useRef, useState, ReactNode, FormEvent } from "react";
import IconBtn from "./IconBtn";
import { cn } from "@shared/lib/utils";
import {
  CreateFriendInviteInput,
} from "@friends/model/types";
import {
  useCreateLink,
  useRequestFriendByUsername
} from "@friends/model/useFriends";
import { Modal } from "@friends/ui/ModalInviter";

type FabAction = {
  id: "add-user" | "share-link";
  label: string;
  rightEl?: ReactNode;
};

type ModalKind = null | "add-user" | "share-link";

const ACTIONS: FabAction[] = [
  { id: "add-user", label: "Añadir usuario", rightEl: <span>＋</span> },
  { id: "share-link", label: "Compartir link", rightEl: <span>🔗</span> },
];

export default function FabMenu() {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  // --- Estado modal "add-user"
  const [username, setUsername] = useState("");
  const [sentOk, setSentOk] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [link, setLink] = useState("");

  // Reemplazar con el userId real (de auth/context)
  const currentUserId = "8f9a8e8f-9fdb-412a-afd5-cd3b52d508ee";


  const {
    create: createLink,
    loading: loadingLink,
    error: errorLink,
  } = useCreateLink();



  const { requestByUsername, loading: loadingInvite, error: errorInvite } = useRequestFriendByUsername();

  // ===== Handlers =====
  const handleCreateLink = async () => {
    setErrMsg(null);
    setSentOk(null);
    setLink("");
    const input = new CreateFriendInviteInput(currentUserId, 24);
    const res = await createLink(input);
    const urlStr = res.data?.createFriendInvite ?? "";
    if (urlStr) setLink(urlStr);
    else setErrMsg("No se pudo crear el link");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setSentOk("¡Link copiado! 📋");
      setTimeout(() => setSentOk(null), 1200);
    } catch {
      setErrMsg("No se pudo copiar el link");
      setTimeout(() => setErrMsg(null), 1500);
    }
  };

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    setErrMsg(null);
    setSentOk(null);
    const res = await requestByUsername(currentUserId, username);
    const ok = res.data?.requestFriendByUsername; 
    if (ok) {
      setSentOk("Solicitud enviada correctamente ✅");
      setTimeout(() => {
        setSentOk(null);
        setUsername("");
        setModal(null);
      }, 1200);
    } else {
      setErrMsg("No se pudo enviar la solicitud");
    }
  };

  // ===== UX: cerrar con click afuera/Escape y foco inicial =====
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (modal) setModal(null);
        else setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* FAB + menú */}
      <div
        ref={rootRef}
        className={cn(
          "fixed right-4 bottom-15 flex flex-col items-end space-y-2",
          "md:static md:ml-2"
        )}
      >
        {/* Panel de acciones */}
        <div
          id="fab-menu"
          role="menu"
          aria-hidden={!open}
          className={cn(
            "origin-bottom-right rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-2",
            "backdrop-blur shadow-[0_0_12px_rgba(76,201,240,.25)]",
            "transition-all duration-150",
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          {ACTIONS.map((a, i) => (
            <button
              key={a.id}
              role="menuitem"
              ref={i === 0 ? firstItemRef : undefined}
              onClick={() => {
                setOpen(false);
                setErrMsg(null);
                setSentOk(null);
                setLink("");
                setModal(a.id);
              }}
              className={cn(
                "flex items-center justify-between w-44 px-3 py-1.5 rounded-md",
                "text-white text-sm hover:bg-cyan-300/10 focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-cyan-300/60"
              )}
            >
              {a.label}
              <span className="ml-2">{a.rightEl}</span>
            </button>
          ))}
        </div>

        {/* Botón FAB */}
        <IconBtn
          icon={open ? "mdi:close" : "mdi:plus"}
          label={open ? "Cerrar menú" : "Nuevo"}
          onClick={() => setOpen((s) => !s)}
          className={cn("w-12 h-12 rounded-full", "aria-expanded:ring-2")}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="fab-menu"
        />
      </div>

      {/* ======= MODAL ADD-USER ======= */}
      {modal === "add-user" && (
        <Modal onClose={() => setModal(null)} title="Invitar por username">
          <form onSubmit={handleInvite} className="space-y-3">
            <label className="block text-sm">
              Username
              <input
                className="mt-1 w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-700"
                placeholder="@usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            {loadingInvite && <p className="text-xs text-white/70">Enviando…</p>}
            {sentOk && <p className="text-xs text-emerald-400">{sentOk}</p>}
            {(errMsg || errorInvite) && (
              <p className="text-xs text-rose-400">
                {errMsg ?? errorInvite?.message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!username || loadingInvite}
                className={cn(
                  "px-3 py-1.5 rounded-md bg-cyan-600/80 hover:bg-cyan-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Enviar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ======= MODAL SHARE-LINK ======= */}
      {modal === "share-link" && (
        <Modal onClose={() => setModal(null)} title="Compartir link">
          <div className="space-y-3">

            <button
              onClick={handleCreateLink}
              disabled={loadingLink}
              className={cn(!link ? 
                "px-3 py-1.5 rounded-md bg-cyan-600/60 hover:bg-cyan-600" : "hidden",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loadingLink ? "Creando…" : "Crear link"}
            </button>

            {!!link && (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={link}
                  readOnly
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5"
                >
                  Copiar
                </button>
              </div>
            )}

            {sentOk && <p className="text-xs text-emerald-400">{sentOk}</p>}
            {(errMsg || errorLink) && (
              <p className="text-xs text-rose-400">
                {errMsg ?? errorLink?.message}
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
