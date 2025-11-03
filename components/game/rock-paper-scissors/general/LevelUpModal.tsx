"use client";

import { Skin } from "@/types/user.types";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLockBodyScroll } from "@/hooks/useBlockBodyScroll";
import { createPortal } from "react-dom";

interface XpBarAnimationProps {
  xpGained: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  unlockedSkins: Skin[];

  xpInCurrentLevelBefore: number;
  xpNeededForLevelBefore: number;
  progressBefore: number;
  xpInCurrentLevelAfter: number;
  xpNeededForLevelAfter: number;
  progressAfter: number;

  oldLevelName: string;
  oldLevelSymbol: string;
  oldLevelColor: string;

  newLevelName: string;
  newLevelSymbol: string;
  newLevelColor: string;

  onComplete: () => void;
}

export default function XpBarAnimation({
  xpGained,
  leveledUp,
  oldLevel,
  newLevel,
  unlockedSkins,
  xpInCurrentLevelBefore,
  xpNeededForLevelBefore,
  progressBefore,
  xpInCurrentLevelAfter,
  xpNeededForLevelAfter,
  progressAfter,
  oldLevelName,
  oldLevelSymbol,
  oldLevelColor,
  newLevelName,
  newLevelSymbol,
  newLevelColor,
  onComplete,
}: XpBarAnimationProps) {
  useLockBodyScroll();
  const [animatedXp, setAnimatedXp] = useState(xpInCurrentLevelBefore);
  const [animatedProgress, setAnimatedProgress] = useState(progressBefore);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [phase, setPhase] = useState<"xp-gain" | "level-up" | "skins">(
    "xp-gain"
  );

  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  const animPropsRef = useRef({
    xpGained,
    leveledUp,
    xpInCurrentLevelBefore,
    xpNeededForLevelBefore,
    progressBefore,
    xpInCurrentLevelAfter,
    xpNeededForLevelAfter,
    progressAfter,
    unlockedSkins,
    onComplete,
  });

  useEffect(() => {
    animPropsRef.current = {
      xpGained,
      leveledUp,
      xpInCurrentLevelBefore,
      xpNeededForLevelBefore,
      progressBefore,
      xpInCurrentLevelAfter,
      xpNeededForLevelAfter,
      progressAfter,
      unlockedSkins,
      onComplete,
    };
  });

  const currentLevelName = showLevelUp ? newLevelName : oldLevelName;
  const currentLevelSymbol = showLevelUp ? newLevelSymbol : oldLevelSymbol;
  const currentLevelColor = showLevelUp ? newLevelColor : oldLevelColor;
  const displayLevel = showLevelUp ? newLevel : oldLevel;

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    let animationFrameId: number;

    const animateXp = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const {
        leveledUp,
        xpInCurrentLevelBefore,
        xpNeededForLevelBefore,
        progressBefore,
        xpInCurrentLevelAfter,
        progressAfter,
        unlockedSkins,
        onComplete,
      } = animPropsRef.current;

      if (leveledUp) {
        if (progress < 0.5) {
          const halfProgress = progress * 2;
          setAnimatedXp(
            xpInCurrentLevelBefore +
              (xpNeededForLevelBefore - xpInCurrentLevelBefore) * halfProgress
          );
          setAnimatedProgress(
            progressBefore + (100 - progressBefore) * halfProgress
          );
        } else {
          setShowLevelUp((prev) => {
            if (!prev) {
              setPhase("level-up");
              return true;
            }
            return prev;
          });

          const secondHalfProgress = (progress - 0.5) * 2;
          setAnimatedXp(xpInCurrentLevelAfter * secondHalfProgress);
          setAnimatedProgress(progressAfter * secondHalfProgress);
        }
      }
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateXp);
      } else {
        setAnimatedXp(xpInCurrentLevelAfter);
        setAnimatedProgress(progressAfter);
        if (unlockedSkins.length > 0) {
          setTimeout(() => {
            setPhase("skins");
            setTimeout(onComplete, 5000);
          }, 2500);
        } else {
          setTimeout(onComplete, 3000);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animateXp);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.6 } }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-9999 p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0, transition: { delay: 0.2 } }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <Icon
              icon="mdi:star-four-points"
              className="text-light-blue text-6xl mx-auto mb-2 drop-shadow-[0_0_14px_var(--color-medium-blue)]"
            />
          </motion.div>
          <div className="text-4xl font-bold text-light-blue flex items-center justify-center gap-3">
            <h2 className="">+{xpGained} </h2>
            <p className="h-10 w-10 ring-3 ring-medium-blue rounded-full text-2xl flex items-center justify-center">
              XP
            </p>
          </div>
        </motion.div>

        <motion.div
          key={currentLevelSymbol}
          initial={
            showLevelUp
              ? {
                  scale: 1,
                  opacity: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }
              : {}
          }
          animate={
            showLevelUp
              ? {
                  scale: [1.2, 1],
                  opacity: 1,
                  backgroundColor: [
                    "rgba(255,255,255,0.3)",
                    "rgba(255,255,255,0.1)",
                  ],
                }
              : {}
          }
          exit={{ x: -20, opacity: 0, transition: { delay: 0.1 } }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                key={currentLevelSymbol}
                initial={showLevelUp ? { scale: 0, rotate: -180 } : {}}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
                className="h-10 w-10 flex items-center justify-center rounded-full border-2"
                style={{ borderColor: currentLevelColor }}
              >
                <p className="font-bold text-font">{currentLevelSymbol}</p>
              </motion.div>
              <div>
                <motion.p
                  key={displayLevel}
                  initial={showLevelUp ? { scale: 1.5, color: "#3b82f6" } : {}}
                  animate={{ scale: 1, color: "#ffffff" }}
                  className="text-font text-lg font-bold"
                >
                  Nivel {displayLevel}
                </motion.p>
                <p className="text-subtitle text-sm">{currentLevelName}</p>
              </div>
            </div>

            <p className="text-font text-lg font-medium">
              {Math.round(animatedXp)}{" "}
              <span className="text-subtitle">
                / {showLevelUp ? xpNeededForLevelAfter : xpNeededForLevelBefore}
              </span>
            </p>
          </div>

          <div className="relative w-full h-4 overflow-hidden rounded-full bg-background">
            <motion.div
              className="h-full absolute rounded-full bg-gradient-to-r from-shadow-blue to-medium-blue"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>

          <p className="text-center text-subtitle text-sm mt-2">
            {Math.round(animatedProgress)}%
          </p>
        </motion.div>

        {showLevelUp && phase === "level-up" && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border-2 border-primary text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Icon
                icon="hugeicons:party"
                className="text-6xl mx-auto mb-2"
              />
            </motion.div>
            <p className="text-subtitle font-medium">
              ¡Felicidades! Has subido de nivel
            </p>
            <h3 className="text-3xl font-bold text-primary">
              ¡Nivel {newLevel}!
            </h3>
            <p className="text-font text-lg mt-1">{newLevelName}</p>
          </motion.div>
        )}

        {phase === "skins" && unlockedSkins.length > 0 && (
          <motion.div
            key="skins"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="mt-6 bg-white/5 rounded-xl p-4 flex flex-col items-center"
          >
            <h4 className="text-lg flex items-center font-semibold text-font text-center">
              <Icon
                icon="mingcute:unlock-fill"
                className="text-2xl mr-2"
              />
              ¡Has desbloqueado nuevos skins!
            </h4>
            <p className="text-subtitle mb-3">Puedes equiparlos en tu perfil</p>
            <div className="flex gap-3 justify-center">
              {unlockedSkins.map((skin, i) => (
                <motion.img
                  key={skin.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.2, type: "spring" }}
                  src={skin.img}
                  alt={skin.name}
                  className="w-16 h-16 rounded-full border-2 border-primary"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>,
    modalRoot
  );
}
