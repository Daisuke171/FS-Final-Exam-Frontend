import { Icon, IconifyIcon } from "@iconify-icon/react";

interface ChipOneInterface {
  value: string;
  icon: IconifyIcon | string;
  color: "primary" | "secondary" | "tertiary";
}

const getBorderColor = (color: string) => {
  switch (color) {
    case "primary":
      return "border-medium-blue";
    case "secondary":
      return "border-shadow-ranking";
    case "tertiary":
      return "border-light-purple";
    default:
      return "border-subtitle";
  }
};

const getTextColor = (color: string) => {
  switch (color) {
    case "primary":
      return "text-light-blue";
    case "secondary":
      return "text-ranking";
    case "tertiary":
      return "text-bright-purple";
    default:
      return "text-subtitle";
  }
};

export default function ChipOne({ value, icon, color }: ChipOneInterface) {
  return (
    <div
      className={`py-1 px-2 bg-background mt-2 rounded-2xl border ${getBorderColor(
        color
      )} w-fit`}
    >
      <p
        className={`text-lg  gap-1 flex items-center ${getTextColor(
          color
        )} font-medium`}
      >
        <Icon
          icon={icon}
          width="18"
        />
        {value}
      </p>
    </div>
  );
}
