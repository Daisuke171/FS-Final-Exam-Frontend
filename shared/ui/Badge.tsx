import { ReactNode, FC } from "react";
import { Icon } from "@iconify/react";

type modeBadge = "message" | "presence"; 

interface BadgeProps {
  children: ReactNode;
  color?: "green" | "pink" | "slate";
  type?: modeBadge;
}


export const Badge: FC<BadgeProps> = ({ children, color = "green", type = "presence" }) => {
  const map = {
    green: "bg-green-500",
    pink: "bg-pink-500",
    slate: "bg-slate-500",
  } as const;

  if (type === "message") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium
                       border border-cyan-300/30 bg-cyan-300/10 text-white shadow-[0_0_6px_rgba(76,201,240,.3)]">
        {children}
       <Icon icon="mdi:chat" color={"cyan"} width={15} height={15} />
      </span>
    );
  }
  if (type === "presence") {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium
                     border border-cyan-300/30 bg-cyan-300/10 text-white shadow-[0_0_6px_rgba(76,201,240,.3)]">
      <i className={`block w-2 h-2 rounded-full ${map[color]}`} />
      {children}
    </span>
  );
}
}
