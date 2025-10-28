interface LvlChipProps {
  lvl: number;
  color: "top-one" | "top-two" | "top-three" | "top-list";
  size: "sm" | "md" | "lg";
}

const colors: { [key: string]: string } = {
  "top-one": "bg-transparent-ranking border-medium-ranking text-ranking",
  "top-two": "bg-transparent-blue border-light-blue text-light-blue",
  "top-three": "bg-transparent-purple border-bright-purple text-bright-purple",
  "top-list": "bg-transparent border-subtitle text-subtitle",
};

const sizes: { [key: string]: string } = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
};

export default function LvlChip({ lvl, color, size }: LvlChipProps) {
  return (
    <div
      className={` ${colors[color]} px-3 py-1 flex ${sizes[size]} items-center gap-1.5 border-2 rounded-lg `}
    >
      <span className="font-medium ">LVL</span>
      <p className="font-bold ">{lvl}</p>
    </div>
  );
}
