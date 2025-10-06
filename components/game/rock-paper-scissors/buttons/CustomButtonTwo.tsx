import { Icon } from "@iconify-icon/react";

interface CustomButtonProps {
  text: string;
  icon?: string;
  onClick?: () => void;
  clicked?: string | null;
  confirmed?: boolean;
  variant?: "filled" | "outlined";
  full?: boolean;
  color?: "primary" | "secondary";
}

export default function CustomButtonTwo({
  text,
  icon,
  onClick,
  clicked,
  confirmed,
  variant = "filled",
  full,
  color = "primary",
}: CustomButtonProps) {
  const outlinedPrimary =
    "border-2 border-indigo-900 text-indigo-900 bg-transparent hover:bg-indigo-900 hover:text-indigo-200";

  const outlinedSecondary =
    "border-2 border-slate-950 text-slate-900 bg-transparent hover:bg-slate-800 hover:border-slate-800 hover:text-slate-200";

  const filledPrimary =
    "bg-indigo-900 text-indigo-100 border-2 border-indigo-900 hover:bg-indigo-800 hover:border-indigo-800";

  const filledSecondary =
    "bg-slate-800 text-slate-200 border-2 border-slate-800 hover:bg-slate-700 hover:border-slate-700";

  const baseStyles =
    "py-4 px-8 w-fit cursor-pointer rounded-xl font-bold flex items-center gap-2 transition-all truncate duration-300";

  const filled = color === "primary" ? filledPrimary : filledSecondary;

  const outlined = color === "primary" ? outlinedPrimary : outlinedSecondary;
  return (
    <button
      className={`${baseStyles} ${variant === "filled" ? filled : outlined} ${
        clicked === null || confirmed
          ? "pointer-events-none opacity-50 shadow-[0px_0px_0px_0px_black]"
          : `transform -translate-y-1 ${
              color === "primary"
                ? "shadow-[0px_4px_0px_0px_var(--color-indigo-950)]"
                : "shadow-[0px_4px_0px_0px_var(--color-slate-950)]"
            }`
      } ${full ? "w-full" : "w-fit"}`}
      disabled={clicked === null || confirmed}
      onClick={() => {
        console.log("🔵 Click en confirmar - Estado ANTES:", {
          clicked,
          confirmed,
        });
        onClick?.();
      }}
    >
      {icon && (
        <Icon
          icon={icon}
          width={25}
        />
      )}
      {text}
    </button>
  );
}
