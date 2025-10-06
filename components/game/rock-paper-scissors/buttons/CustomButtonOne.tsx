import { Icon, IconifyIcon } from "@iconify-icon/react";

interface CustomButtonProps {
  text: string;
  action?: () => void;
  icon?: IconifyIcon | string;
  full?: boolean;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary";
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function CustomButtonOne({
  text,
  action,
  icon,
  full,
  variant = "filled",
  color = "primary",
  loading,
  type = "button",
}: CustomButtonProps) {
  const outlinedPrimary =
    "border-2 border-light-purple text-hover-purple bg-transparent hover:border-hover-purple";

  const outlinedSecondary =
    "border-2 border-medium-blue text-light-blue bg-transparent hover:border-light-blue";

  const outlinedLoading =
    "border-2 border-slate-400 opacity-50 text-slate-400 bg-transparent pointer-events-none cursor-not-allowed";

  const filledPrimary =
    "bg-light-purple text-font border-2 border-light-purple hover:bg-hover-purple hover:border-hover-purple";

  const filledSecondary =
    "bg-slate-900 text-slate-200 border-2 border-slate-900 hover:bg-slate-700";

  const filledLoading =
    "bg-slate-400 text-slate-200 border-2 border-slate-400 pointer-events-none cursor-not-allowed";

  const outlined = loading
    ? outlinedLoading
    : color === "primary"
    ? outlinedPrimary
    : outlinedSecondary;
  const filled =
    color === "primary" && loading
      ? filledLoading
      : color === "primary"
      ? filledPrimary
      : filledSecondary;

  const baseStyles =
    "py-4 px-8 w-fit cursor-pointer rounded-xl font-bold flex items-center gap-2 transition-all truncate";
  return (
    <div className={`relative group ${full ? "w-full" : "w-fit"}`}>
      <button
        className={`${baseStyles} ${variant === "filled" ? filled : outlined}`}
        onClick={action}
        type={type}
      >
        {loading ? (
          <Icon
            icon="line-md:loading-twotone-loop"
            width="24"
            height="24"
          />
        ) : icon ? (
          <Icon
            icon={icon}
            width="24"
            height="24"
          />
        ) : null}
        {text}
      </button>
      {variant === "outlined" && (
        <div
          className={`absolute inset-0 rounded-lg transform
              ${
                color === "primary" ? "bg-shadow-purple" : "bg-shadow-blue"
              } blur-2xl duration-500 -z-10 transition-all opacity-0 group-hover:opacity-60`}
        ></div>
      )}
    </div>
  );
}
