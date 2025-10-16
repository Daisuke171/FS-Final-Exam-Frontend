import { Icon } from "@iconify/react";

export default function GenericErrorCard({
  title,
  message,
}: {
  message: string;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center max-w-[95%] justify-center bg-white/7 p-6 md:p-8 lg:p-10 rounded-2xl">
      <Icon
        icon="mynaui:sad-ghost"
        width="50"
        className="text-font"
      />
      <h2 className="text-2xl font-bold text-light-error">{title}</h2>
      <p className="text-subtitle">{message}</p>
    </div>
  );
}
