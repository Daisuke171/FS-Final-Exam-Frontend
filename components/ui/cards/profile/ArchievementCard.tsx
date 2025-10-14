import { Icon } from "@iconify/react";
import { useState } from "react";

export type ArchievementCardProps = {
  title: string;
  desc: string;
  type: "common" | "uncommon" | "rare" | "epic" | "legendary";
};

const background = {
  common: "bg-transparent-gray border-light-gray",
  uncommon: "bg-transparent-bronze border-light-bronze",
  rare: "bg-transparent-blue border-shadow-blue",
  epic: "bg-transparent-purple border-light-purple",
  legendary: "bg-transparent-ranking border-medium-ranking",
};

const iconColor = {
  common: "text-subtitle",
  uncommon: "text-light-bronze",
  rare: "text-light-blue drop-shadow-[0_0_14px_var(--color-medium-blue)]",
  epic: "text-bright-purple drop-shadow-[0_0_14px_var(--color-hover-purple)]",
  legendary: "text-ranking drop-shadow-[0_0_14px_var(--color-medium-ranking)]",
};

const textColor = {
  common: "text-subtitle",
  uncommon: "text-light-bronze",
  rare: "text-light-blue",
  epic: "text-bright-purple",
  legendary: "text-ranking",
};

const starsMap = {
  common: 0,
  uncommon: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

const label = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function ArchievementCard({
  title,
  desc,
  type,
}: ArchievementCardProps) {
  const [flipped, setFlipped] = useState(false);
  const stars = starsMap[type];
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className={`border-2 relative  ${
        background[type]
      } [transform-style:preserve-3d] ${
        flipped ? "[transform:rotateY(180deg)]" : ""
      } cursor-pointer w-full max-w-32 md:max-w-40 h-46 md:h-54 p-3 md:p-4 md:pb-8 rounded-xl hover:scale-105 flex flex-col transition-transform duration-500 items-center justify-between`}
    >
      <div className="flex flex-col items-center h-full gap-3 [backface-visibility:hidden]">
        <div className="flex flex-col items-center">
          <div className="flex">
            {stars === 0 && <div className="h-[15px]"></div>}
            {[...Array(stars)].map((_, index) => (
              <Icon
                key={index}
                icon="material-symbols:star-rounded"
                className={`${iconColor[type]} text-[12px] md:text-[15px]`}
              />
            ))}
          </div>
          <Icon
            icon="heroicons:trophy-20-solid"
            className={`${iconColor[type]} mb-2 text-[50px] md:text-[65px]`}
          />
          <div
            className={`border rounded-2xl py-0.5 px-2 ${textColor[type]} bg-black/10 backdrop-blur-md`}
          >
            <p className="text-xs md:text-sm font-medium">{label[type]}</p>
          </div>
        </div>
        <h3 className="text-font font-medium text-center text-xs md:text-sm">
          {title}
        </h3>
        <Icon
          icon="tabler:arrow-back"
          className={`absolute ${textColor[type]} bottom-1 right-1 text-xl md:text-2xl`}
        />
      </div>

      <div
        className={`absolute inset-0 ${background[type]} rounded-xl gap-3 flex flex-col items-center justify-center px-3 [transform:rotateY(180deg)] [backface-visibility:hidden]`}
      >
        <div
          className={`flex flex-col items-center gap-3 ${textColor[type]} justify-start h-[60%]`}
        >
          <Icon
            icon="material-symbols:info-outline"
            width="30"
          />
          <p className="text-center font-medium text-xs md:text-sm">{desc}</p>
        </div>
      </div>
    </div>
  );
}
