import { useEffect, useState } from "react";

function useBreakpoint() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width === null) return "loading";
  if (width < 768) return "mobile"; // md
  if (width < 1024) return "tablet"; // lg
  return "desktop";
}

export default useBreakpoint;
