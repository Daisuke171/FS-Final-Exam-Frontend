"use client";

import Image from "next/image";
import LandingChip from "../../chips/LandingChip";
import { ReactNode } from "react";
import { motion } from "motion/react";
import useBreakpoint from "@/hooks/useBreakpoint";

export interface ProgressArticleProps {
  title: string;
  desc: ReactNode;
  chipicon: string;
  chiptext: string;
  image: string;
  color?: "blue" | "purple" | "red" | "green" | "yellow";
  reverse?: boolean;
  listItems: string[];
}

const getBorderColor = {
  blue: "border-medium-blue",
  purple: "border-light-purple",
  red: "border-error",
  green: "border-success",
  yellow: "border-ranking",
};

const getGradientColor = {
  blue: "from-shadow-blue to-medium-blue",
  purple: "from-shadow-purple to-light-purple",
  red: "from-error to-light-error",
  green: "from-shadow-success to-success",
  yellow: "from-ranking to-light-ranking",
};

const getMarkerColor = {
  blue: "marker:text-medium-blue",
  purple: "marker:text-light-purple",
  red: "marker:text-error",
  green: "marker:text-success",
  yellow: "marker:text-ranking",
};

const getRightBorderColor = {
  blue: "border-shadow-blue",
  purple: "border-light-purple",
  red: "border-error",
  green: "border-success",
  yellow: "border-shadow-ranking",
};

export default function ProgressArticle({
  title,
  desc,
  chipicon,
  chiptext,
  image,
  color = "blue",
  reverse = false,
  listItems,
}: ProgressArticleProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isMobile ? 0.4 : 0.5 }}
      transition={{ duration: 0.6 }}
      className={`flex w-full max-w-160 lg:max-w-none lg:w-auto ${
        reverse
          ? "flex-col-reverse lg:flex-row-reverse"
          : "flex-col lg:flex-row"
      } lg:items-stretch  overflow-hidden bg-black/30 max-h-full 
        rounded-2xl border ${getBorderColor[color]}`}
    >
      <div
        className={`lg:max-w-[95%] lg:w-130 p-6 md:p-8 ${
          reverse
            ? "border-t lg:border-l lg:border-t-0"
            : "border-b lg:border-r lg:border-b-0"
        } ${getRightBorderColor[color]}`}
      >
        <LandingChip
          icon={chipicon}
          text={chiptext}
          color={color}
        />
        <h3 className="text-2xl text-font flex items-center font-medium mb-3 gap-2">
          {title}
        </h3>
        <div
          className={`h-1 w-40 bg-gradient-to-r ${getGradientColor[color]} rounded-full`}
        ></div>
        <p className="text-subtitle my-6 text-base md:text-lg">{desc}</p>
        <ul
          className={`flex flex-col text-sm md:text-base font-medium gap-3 list-disc list-inside text-subtitle ${getMarkerColor[color]}`}
        >
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div
        className={`${
          reverse
            ? "rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none"
            : "rounded-b-2xl lg:rounded-r-2xl  lg:rounded-b-none"
        } max-h-120 lg:max-h-none lg:w-full lg:max-w-125 overflow-hidden`}
      >
        <Image
          src={image}
          alt={title}
          className={`${
            reverse
              ? "rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none"
              : "rounded-b-2xl lg:rounded-r-2xl lg:rounded-b-none"
          } h-full w-full object-cover`}
          width={800}
          height={800}
        />
      </div>
    </motion.article>
  );
}
