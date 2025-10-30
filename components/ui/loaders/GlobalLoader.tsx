import { Icon } from "@iconify/react";

export default function GlobalLoader() {
  return (
    <div className="w-full h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col gap-8 items-center mt-[75.5px]">
        <p className="text-2xl text-font font-medium">Cargando...</p>
        <Icon
          icon="svg-spinners:blocks-shuffle-3"
          className="text-[120px] text-bright-purple"
        />
      </div>
    </div>
  );
}
