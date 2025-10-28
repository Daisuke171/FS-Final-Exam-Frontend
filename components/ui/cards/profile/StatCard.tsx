"use client";

import { Icon, IconifyIcon } from "@iconify/react";

export interface StatCardProps {
  icon: IconifyIcon | string;
  title: string;
  number: number | string;
  color?: "defeat" | "victory" | "draw" | "neutral" | "purple" | "success";
}

function getIconColor(color: string) {
  switch (color) {
    case "defeat":
      return "text-light-error";
    case "victory":
      return "text-ranking";
    case "draw":
      return "text-light-gray";
    case "neutral":
      return "text-light-blue";
    case "purple":
      return "text-bright-purple";
    case "success":
      return "text-light-success";
    default:
      return "text-subtitle";
  }
}

export default function StatCard({
  icon,
  title,
  number,
  color,
}: StatCardProps) {
  return (
    <div className="flex flex-col items-center w-24 xl:w-26 px-0 xl:px-2">
      <Icon
        icon={icon}
        className={`${getIconColor(
          color || "neutral"
        )} text-[40px] md:text-5xl`}
      />
      <p className="text-font text-base md:text-lg font-medium mt-3 mb-1">
        {number}
      </p>
      <p className="text-subtitle text-center text-sm font-medium">{title}</p>
    </div>
  );
}
