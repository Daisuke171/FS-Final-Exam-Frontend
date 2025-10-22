import { Icon, IconifyIcon } from "@iconify-icon/react";

interface CustomButtonProps {
  text?: string;
  action?: () => void;
  icon?: IconifyIcon | string;
  full?: boolean;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary" | "error" | "white";
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  center?: boolean;
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
  size = "md",
  disabled,
  center,
}: CustomButtonProps) {
  const selectedSize =
    size === "sm"
      ? "py-2 px-4 text-sm rounded-lg"
      : size === "md"
      ? "py-3 px-6 text-base rounded-lg"
      : "py-4 px-8 text-lg rounded-xl";

  const outlinedPrimary =
    "border-2 border-light-purple text-bright-purple bg-transparent hover:border-bright-purple";

  const outlinedSecondary =
    "border-2 border-medium-blue text-light-blue bg-transparent hover:border-light-blue";

  const outlinedError =
    "border-2 border-error text-error bg-transparent hover:border-light-error";

  const outlinedWhite =
    "border-2 border-subtitle text-subtitle bg-transparent hover:border-font";

  const outlinedLoading =
    "border-2 border-light-gray opacity-60 text-light-gray bg-transparent pointer-events-none cursor-not-allowed";

  const filledPrimary =
    "bg-light-purple text-font border-2 border-light-purple hover:bg-hover-purple hover:border-hover-purple";

  const filledSecondary =
    "bg-shadow-blue text-font border-2 border-shadow-blue hover:bg-medium-blue hover:border-medium-blue";

  const filledError =
    "bg-shadow-error text-font border-2 border-shadow-error hover:bg-dark-error hover:border-dark-error";

  const filledWhite =
    "bg-subtitle text-background border-2 border-subtitle hover:bg-font hover:border-font";

  const filledLoading =
    "bg-dark-gray text-font border-2 opacity-30 border-dark-gray pointer-events-none cursor-not-allowed";

  const glow = {
    primary: "bg-shadow-purple",
    secondary: "bg-shadow-blue",
    error: "bg-shadow-error",
    white: "bg-white/30",
  };

  const outlined =
    loading || disabled
      ? outlinedLoading
      : color === "primary"
      ? outlinedPrimary
      : color === "secondary"
      ? outlinedSecondary
      : color === "white"
      ? outlinedWhite
      : outlinedError;

  const filled =
    loading || disabled
      ? filledLoading
      : color === "primary"
      ? filledPrimary
      : color === "secondary"
      ? filledSecondary
      : color === "white"
      ? filledWhite
      : filledError;

  const textPosition = center ? "justify-center" : "";

  const baseStyles = `${selectedSize} w-full cursor-pointer font-medium flex items-center ${textPosition} gap-2 transition-all truncate`;
  return (
    <div className={`relative z-1 group ${full ? "w-full" : "w-fit"}`}>
      <button
        className={`${baseStyles} ${variant === "filled" ? filled : outlined}`}
        onClick={action}
        type={type}
      >
        {loading ? (
          <Icon
            icon="line-md:loading-twotone-loop"
            width={size === "sm" ? 22 : size === "md" ? 24 : 26}
          />
        ) : icon ? (
          <Icon
            icon={icon}
            width={size === "sm" ? 22 : size === "md" ? 24 : 26}
          />
        ) : null}
        {text}
      </button>
      {variant === "outlined" && !loading && (
        <div
          className={`absolute inset-0 rounded-lg transform
              ${glow[color]} blur-2xl duration-500 -z-10 transition-all opacity-0 group-hover:opacity-60`}
        ></div>
      )}
    </div>
  );
}
