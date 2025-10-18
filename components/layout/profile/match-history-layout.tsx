import CustomSelect from "@/components/ui/inputs/CustomSelect";
import { Icon } from "@iconify/react";

export default function MatchHistoryLayout({
  children,
  action,
}: {
  action: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white/7 p-4 py-6 md:p-6 lg:p-8 w-[52%] rounded-2xl flex-1 flex flex-col ">
      <div className="flex items-center gap-3 md:gap-0 flex-col md:flex-row justify-between">
        <h2 className="text-xl lg:text-2xl font-medium text-font flex  items-center gap-2 ">
          <Icon
            icon="solar:book-bold"
            className="text-2xl md:text-3xl"
          />
          Historial <span className="text-subtitle">(últimas 10 partidas)</span>
        </h2>
        <CustomSelect
          options={[
            { value: "all", label: "Todos" },
            { value: "won", label: "Victorias" },
            { value: "lost", label: "Derrotas" },
            { value: "draw", label: "Empates" },
          ]}
          onChange={action}
          placeholder="Todos"
          defaultValue="all"
        />
      </div>
      <div className="flex flex-col mt-5 md:mt-10 gap-3 flex-grow pr-1 lg:pr-2 w-full min-h-[200px] max-h-150 md:max-h-181 [@media(min-width:913px)_and_(max-width:1024px)]:max-h-111 lg:max-h-250 xl:max-h-186 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </section>
  );
}
