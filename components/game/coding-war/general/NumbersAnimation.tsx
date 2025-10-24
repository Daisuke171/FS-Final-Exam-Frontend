"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

export default function NumbersAnimation({
  value,
  delay,
}: {
  value: number;
  delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, delay });
    return controls.stop;
  }, [value, count, delay]);

  return <motion.span>{rounded}</motion.span>;
}
