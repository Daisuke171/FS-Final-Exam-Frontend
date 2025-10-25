import { Icon } from "@iconify/react";
import { formatNumber } from "@/utils/formatNumber";
import { motion, useMotionValueEvent, useInView } from "motion/react";
import { useAnimatedFormattedNumber } from "@/hooks/useAnimatedFormater";
import { useRef, useState } from "react";

interface LpStatCardProps {
  icon: string;
  title: string;
  value: number;
  color?: string;
}

export default function LpStatCard({
  icon,
  title,
  value,
  color,
}: LpStatCardProps) {
  const [display, setDisplay] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const number = useAnimatedFormattedNumber(isInView ? value : 0, {
    duration: 2,
    formatter: formatNumber,
  });

  useMotionValueEvent(number, "change", (v) => {
    setDisplay(v);
  });
  return (
    <div
      ref={ref}
      className={`flex flex-col items-center p-4`}
    >
      <Icon
        icon={icon}
        className={`text-7xl md:text-8xl ${color}`}
      />

      <motion.span
        key={display}
        initial={{ y: 5, scale: 0.9, opacity: 0.8 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold my-2 text-font"
      >
        {number}
      </motion.span>

      <h3 className="text-base md:text-lg text-center text-subtitle font-medium max-w-[15ch]">
        {title}
      </h3>
    </div>
  );
}
