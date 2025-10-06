import { Icon } from "@iconify/react";

export default function LoaderCard() {
  return (
    <div className="fixed top-1/2 left-1/2 transform min-w-110 -translate-x-1/2 -translate-y-1/2 glass-box-one flex flex-col items-center justify-center gap-4">
      <h2 className="text-font text-center text-4xl font-bold">Cargando...</h2>
      <Icon
        icon="line-md:loading-twotone-loop"
        width="110"
        className="text-light-purple"
      />
    </div>
  );
}
