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
  size?: "sm" | "md" | "lg";
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
  size = "md",
}: CustomButtonProps) {
  const selectedSize =
    size === "sm"
      ? "py-2 px-4 text-sm"
      : size === "md"
      ? "py-3 px-6 text-base"
      : "py-4 px-8 text-lg";
  const outlinedPrimary =
    "border-2 border-indigo-900 text-indigo-900 bg-transparent hover:bg-indigo-900 hover:text-indigo-200";

  const outlinedSecondary =
    "border-2 border-medium-blue text-light-blue bg-transparent hover:border-light-blue";
  const filledPrimary =
    "bg-light-purple text-font border-2 border-light-purple hover:bg-hover-purple hover:border-hover-purple";

  const filledSecondary =
    "bg-slate-800 text-slate-200 border-2 border-slate-800 hover:bg-slate-700 hover:border-slate-700";

  const baseStyles = `${selectedSize} cursor-pointer rounded-xl font-bold flex justify-center items-center gap-2 transition-all truncate duration-300`;

  const filled = color === "primary" ? filledPrimary : filledSecondary;

  const outlined = color === "primary" ? outlinedPrimary : outlinedSecondary;
  return (
    <div className={`relative ${full ? "w-full" : "w-fit"} group`}>
      <button
        onClick={onClick}
        className={`${baseStyles} ${variant === "filled" ? filled : outlined} ${
          clicked === null || confirmed
            ? "pointer-events-none opacity-50 shadow-[0px_0px_0px_0px_black]"
            : `transform -translate-y-1 ${
                color === "primary"
                  ? "shadow-[0px_4px_0px_0px_var(--color-shadow-purple)]"
                  : "shadow-[0px_4px_0px_0px_var(--color-neutral-950)]"
              }`
        } w-full`}
        disabled={clicked === null || confirmed}
      >
        {icon && (
          <Icon
            icon={icon}
            width={25}
          />
        )}
        {text}
        {variant === "outlined" && (
          <div
            className="absolute inset-0 rounded-lg transform
              bg-shadow-blue blur-2xl duration-500 -z-10 transition-all opacity-0 group-hover:opacity-60"
          ></div>
        )}
      </button>
    </div>
  );
}
