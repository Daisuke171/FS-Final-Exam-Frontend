"use client";

import { Icon } from "@iconify/react";
import { ReactNode } from "react";
import { motion, useAnimation } from "motion/react";

export interface AboutCardProps {
  icon: string;
  title: string;
  desc: ReactNode;
  color: "primary" | "secondary" | "tertiary";
}

const borderColor = {
  primary: "border-medium-blue",
  secondary: "border-success",
  tertiary: "border-ranking",
};

const bgHover = {
  primary: "group-hover:bg-light-blue",
  secondary: "group-hover:bg-light-success",
  tertiary: "group-hover:bg-ranking",
};

const iconColor = {
  primary: "text-light-blue",
  secondary: "text-light-success",
  tertiary: "text-ranking",
};

const glowColor = {
  primary: "hover:shadow-[0px_0px_16px_var(--color-dark-blue)]",
  secondary: "hover:shadow-[0px_0px_16px_var(--color-shadow-success)]",
  tertiary: "hover:shadow-[0px_0px_16px_var(--color-shadow-ranking)]",
};

export default function AboutCard({
  icon,
  title,
  desc,
  color = "primary",
}: AboutCardProps) {
  const controls = useAnimation();

  const handleHoverStart = async () => {
    // Mueve el reflejo al centro
    await controls.start({
      x: "40%",
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    });
    controls.start({
      opacity: [1, 0.8, 1, 0.8, 0.8, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  };

  const handleHoverEnd = () => {
    controls.start({
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    });
  };
  return (
    <motion.div
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={`relative hover:transform group md:hover:-translate-y-7 ${glowColor[color]} transition-all
       duration-500 overflow-hidden p-6 text-center w-fit max-w-79.5 rounded-2xl flex flex-col items-center
        bg-white/5 hover:bg-white/7 
      border-2 ${borderColor[color]}`}
    >
      <motion.div
        animate={controls}
        initial={{ x: "-100%", opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r
          from-transparent via-white/14 to-transparent skew-x-[-25deg]"
        />
      </motion.div>
      <div>
        <Icon
          icon={icon}
          className={`text-font text-[140px] ${iconColor[color]} mb-3`}
        />
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <div
        className={`h-0.5 w-[80%] group-hover:w-[90%] transition-all duration-500 bg-light-gray ${bgHover[color]} rounded-full my-3`}
      ></div>
      <p className="text-subtitle">{desc}</p>
    </motion.div>
  );
}
