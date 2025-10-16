import { Icon } from "@iconify/react";
import { ReactNode } from "react";

interface StatsLayoutProps {
  margin?: boolean;
  children: ReactNode;
}

export default function StatsLayout({ children, margin }: StatsLayoutProps) {
  return (
    <article
      className={`w-full bg-white/7 p-4 py-6 md:p-6 lg:p-8 rounded-2xl ${
        margin && "mt-5"
      }`}
    >
      <h2 className="text-xl lg:text-2xl flex items-center gap-2 text-font font-medium">
        <Icon
          icon="gridicons:stats-up"
          className="text-2xl lg:text-3xl"
        />
        Estadísticas
      </h2>
      <div className=" mt-6 md:mt-8 lg:mt-10 flex items-start flex-wrap gap-3 md:gap-4 lg:gap-0 justify-center">
        {children}
      </div>
    </article>
  );
}
