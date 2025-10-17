import { Icon } from "@iconify/react";
import CustomTextInput from "../inputs/text/CustomTextInput";

interface JoinByPasswordProps {
  error: string | null;
  message: string | null;
  action: () => void;
}

export default function JoinByPassword({
  error,
  message,
  action,
}: JoinByPasswordProps) {
  return (
    <div className="glass-box-one w-130 flex flex-col">
      <div className="flex items-center gap-2 mb-10 w-full">
        <Icon
          icon="material-symbols:lock"
          width={70}
          className="text-font"
        />
        <div>
          <h2 className="text-4xl font-bold text-font">{message}</h2>
          <p className="text-lg text-subtitle">
            Ingresa la contraseña para unirte
          </p>
        </div>
      </div>
      <CustomTextInput
        placeholder="Contraseña"
        name="password"
        type="password"
        action={action}
        icon="material-symbols:subdirectory-arrow-left"
      />
      {error && <p className="text-error mt-3">{error}</p>}
    </div>
  );
}
