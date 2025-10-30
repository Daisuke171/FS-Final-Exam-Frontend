import { Icon } from "@iconify/react";

export interface NotificationProps {
  icon: string;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  type?: "game" | "friend" | "reward" | "achievement";
}

const getTitleColor = {
  game: "text-bright-purple",
  friend: "text-light-blue",
  reward: "text-light-success",
  achievement: "text-light-ranking",
};

const containerColor = {
  game: "bg-light-purple/20 border-bright-purple",
  friend: "bg-medium-blue/20 border-light-blue",
  reward: "bg-success/20 border-success",
  achievement: "bg-ranking/20 border-ranking",
};

const getDescColor = {
  game: "text-bright-purple/75",
  friend: "text-light-blue/75",
  reward: "text-light-success/75",
  achievement: "text-light-ranking/75",
};

export default function Notification({
  icon,
  title,
  desc,
  time,
  type = "game",
  unread = false,
}: NotificationProps) {
  return (
    <div
      className={`flex items-start relative backdrop-blur-sm  gap-4 md:gap-5 p-4 md:p-5 border rounded-xl ${containerColor[type]}`}
    >
      {unread && (
        <span className="absolute top-3 right-3 w-3 h-3 bg-error rounded-full" />
      )}
      <Icon
        icon={icon}
        className={`text-3xl ${getTitleColor[type]}`}
      />
      <div className="flex flex-col">
        <h3
          className={`text-base lg:text-lg font-medium mb-2 leading-none ${getTitleColor[type]}`}
        >
          {title}
        </h3>
        <p className={`text-sm lg:text-base ${getDescColor[type]} mb-3`}>
          {desc}
        </p>
        <p className={`text-xs lg:text-sm ${getDescColor[type]}`}>{time}</p>
      </div>
    </div>
  );
}
