import { Icon } from "@iconify/react";
import Notification, { NotificationProps } from "./Notification";

const notifications: NotificationProps[] = [
  {
    type: "achievement",
    title: "¡Nuevo logro desbloqueado!",
    desc: "Ganaste 'Maestro del RPS'",
    time: "Hace 5 min",
    icon: "mdi:trophy",
    unread: true,
  },
  {
    type: "friend",
    title: "Solicitud de amistad",
    desc: "JohnDoe quiere ser tu amigo",
    time: "Hace 15 min",
    icon: "solar:user-bold",
    unread: true,
  },
  {
    type: "game",
    title: "¡Desafío recibido!",
    desc: "MikeGamer te retó en Chess Battle",
    time: "Hace 1h",
    icon: "game-icons:crossed-swords",
    unread: false,
  },
  {
    type: "reward",
    title: "Recompensa diaria",
    desc: "Recoge tus 50 XP diarios",
    time: "Hace 2h",
    icon: "mdi:gift",
    unread: false,
  },
];

export default function NotificationsSection() {
  return (
    <section className="w-full md:w-[40%]">
      <div className="flex justify-between items-start">
        <h2
          className="text-xl md:text-2xl mb-5 text-font pb-3 font-medium flex items-center relative gap-2 after:h-0.5
              after:absolute after:w-2/3 after:bg-gradient-to-r after:from-light-ranking after:to-ranking
              after:-bottom-1 after:left-0 after:rounded-full"
        >
          <Icon
            icon={"mdi:bell"}
            className="text-ranking text-2xl md:text-3xl"
          />
          Notificaciones
        </h2>
        <span
          className="w-6 h-6 md:h-8 md:w-8 rounded-full bg-error text-font flex 
              items-center justify-center font-bold leading-none text-base md:text-xl"
        >
          2
        </span>
      </div>
      <div className="flex flex-col h-full max-h-155 gap-3 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 && (
          <div className="flex flex-col gap-5 items-center justify-center md:justify-start bg-white/4 h-full md:h-screen p-5 w-full rounded-xl">
            <Icon
              icon="mdi:bell-off"
              className="text-font text-[70px] md:text-[95px] md:mt-35"
            />
            <p className="text-font text-center text-lg font-medium">
              No tienes notificaciones
            </p>
          </div>
        )}
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            {...notification}
          />
        ))}
      </div>
    </section>
  );
}
