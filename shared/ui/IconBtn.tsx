import { Icon } from "@iconify/react";
export default function IconBtn({ icon, label, className = "", onClick, sizeIcon = 20 }: {
  icon: string; label?: string; className?: string; onClick?: () => void; sizeIcon?: number;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label ?? icon}
      className={`grid place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 
                 text-cyan-200 hover:bg-cyan-300/15 hover:text-cyan-100 
                 shadow-[0_0_8px_rgba(76,201,240,.4)] transition-colors ${className}`}
    >
      <Icon icon={icon} width={sizeIcon} height={sizeIcon} />
    </button>
  );
}
