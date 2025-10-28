import { motion } from "motion/react";
import CustomButtonOne from "../buttons/CustomButtonOne";
import { Icon, IconifyIcon } from "@iconify/react";

interface RoomErrorCardProps {
  error: string;
  icon: IconifyIcon | string;
  action?: () => void;
  subtitle?: string;
}

export default function RoomErrorCard({
  error,
  icon,
  action,
  subtitle,
}: RoomErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col glass-box-one items-center gap-5 w-140 max-w-[90%] mt-10"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-font">{error}</h2>
        {subtitle && (
          <p className="text-subtitle text-xl md:text-2xl text-center">
            {subtitle}
          </p>
        )}
      </div>
      <Icon
        icon={icon}
        width={150}
        className="text-font"
      />
      <CustomButtonOne
        text="Volver al inicio"
        variant="outlined"
        color="secondary"
        action={action}
        icon="streamline:return-2"
      />
    </motion.div>
  );
}
