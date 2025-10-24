import { IconifyIcon } from "@iconify/react";

export interface CardProps {
  title: string;
  img: IconifyIcon | string;
  onClick?: () => void;
  isClicked?: boolean;
  disableCards?: boolean;
}
