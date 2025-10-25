import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function AuthDropdown() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/7 backdrop-blur-md p-5 rounded-lg absolute top-12 right-0 w-60"
    >
      <p className="text-font font-medium mb-5">Inicia sesión o regístrate</p>
      <div className="flex flex-col items-center gap-3">
        <CustomButtonOne
          full
          text="Iniciar Sesión"
          size="sm"
          variant="outlined"
          icon={"material-symbols:login-rounded"}
          color="white"
          action={() => signIn()}
        />
        <CustomButtonOne
          full
          text="Registrarse"
          icon={"tabler:user-up"}
          size="sm"
          color="white"
          action={() => router.push("/register")}
        />
      </div>
    </motion.div>
  );
}
