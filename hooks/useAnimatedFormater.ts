"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
  Easing,
} from "motion/react";

export function useAnimatedFormattedNumber(
  to: number,
  options: {
    from?: number;
    duration?: number;
    ease?: Easing;
    formatter?: (value: number) => string;
  } = {}
) {
  const { from = 0, duration = 2, ease = "easeOut", formatter } = options;

  const motionValue: MotionValue<number> = useMotionValue(from);

  const formatted = useTransform(motionValue, (v) => {
    return formatter ? formatter(v) : Math.round(v).toString();
  });

  useEffect(() => {
    const controls = animate(motionValue, to, {
      duration,
      ease,
    });

    return () => controls.stop();
  }, [to, duration, ease, motionValue]);

  return formatted;
}
