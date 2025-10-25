import { Icon } from "@iconify/react";

interface LandingChipProps {
  icon: string;
  text: string;
  color: "blue" | "purple" | "red" | "green" | "yellow";
  size?: "sm" | "md" | "lg";
}

const getColor = {
  blue: "text-bright-blue border-medium-blue bg-medium-blue/20",
  purple: "text-bright-purple border-light-purple bg-light-purple/20",
  red: "text-light-error border-error bg-error/20",
  green: "text-light-success border-success bg-success/20",
  yellow: "text-ranking border-ranking bg-medium-ranking/20",
};

const getSize = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
};

export default function LandingChip({
  icon,
  text,
  color,
  size = "md",
}: LandingChipProps) {
  return (
    <div
      className={`flex gap-1 mb-5 w-fit items-center ${getSize[size]} px-2 py-1 rounded-full border ${getColor[color]}`}
    >
      <Icon
        icon={icon}
        width="20"
      />
      {text}
    </div>
  );
}
