import { useEffect, useState } from "react";

interface UseScrollDirectionOptions {
  threshold?: number;
  topOffset?: number;
}

export function useScrollDirection(options?: UseScrollDirectionOptions) {
  const { threshold = 80, topOffset = 10 } = options || {};

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY < topOffset) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > threshold) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [lastScrollY, threshold, topOffset]);

  return {
    isVisible,
    scrollY,
    isScrollingDown: scrollY > lastScrollY,
    isScrollingUp: scrollY < lastScrollY,
    isAtTop: scrollY < topOffset,
  };
}
