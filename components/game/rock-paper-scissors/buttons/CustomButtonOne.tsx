import { Icon, IconifyIcon } from "@iconify-icon/react";

interface CustomButtonProps {
  text?: string;
  action?: () => void;
  icon?: IconifyIcon | string;
  full?: boolean;
  variant?: "filled" | "outlined";
  color?: "primary" | "secondary";
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
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
}: CustomButtonProps) {
  const selectedSize =
    size === "sm"
      ? "py-2 px-4 text-sm"
      : size === "md"
      ? "py-3 px-6 text-base"
      : "py-4 px-8 text-lg";

  const outlinedPrimary =
    "border-2 border-light-purple text-bright-purple bg-transparent hover:border-bright-purple";

  const outlinedSecondary =
    "border-2 border-medium-blue text-light-blue bg-transparent hover:border-light-blue";

  const outlinedLoading =
    "border-2 border-light-gray opacity-60 text-light-gray bg-transparent pointer-events-none cursor-not-allowed";

  const filledPrimary =
    "bg-light-purple text-font border-2 border-light-purple hover:bg-hover-purple hover:border-hover-purple";

  const filledSecondary =
    "bg-shadow-blue text-font border-2 border-shadow-blue hover:bg-medium-blue hover:border-medium-blue";

  const filledLoading =
    "bg-dark-gray text-font border-2 opacity-60 border-dark-gray pointer-events-none cursor-not-allowed";

  const outlined = loading
    ? outlinedLoading
    : color === "primary"
    ? outlinedPrimary
    : outlinedSecondary;
  const filled = loading
    ? filledLoading
    : color === "primary"
    ? filledPrimary
    : filledSecondary;

  const baseStyles = `${selectedSize} w-fit cursor-pointer rounded-xl font-medium flex items-center gap-2 transition-all truncate`;
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
              ${
                color === "primary" ? "bg-shadow-purple" : "bg-shadow-blue"
              } blur-2xl duration-500 -z-10 transition-all opacity-0 group-hover:opacity-60`}
        ></div>
      )}
    </div>
  );
}
