"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomFormInput from "@/components/ui/inputs/CustomFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { useState, useTransition } from "react";
import { motion } from "motion/react";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "El campo es obligatorio")
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isUsername = /^[a-zA-Z0-9_]+$/.test(val);
        return isEmail || isUsername;
      },
      {
        message: "Debe ser un correo o nombre de usuario válido",
      }
    ),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(16, "La contraseña es demasiado larga"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      usernameOrEmail: data.identifier,
      password: data.password,
      redirect: false,
    });

    const customError = "El usuario o la contraseña son incorrectos";

    if (result?.error) {
      setLoginError(customError);
    } else {
      console.log("✅ Login exitoso!");
      window.location.href = "/";
      setLoginError(null);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      startTransition(async () => {
        await signIn("google", {
          callbackUrl: "/",
        });
      });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setIsGoogleLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <CustomFormInput
        placeholder="Usuario o Correo"
        type="text"
        icon={"mdi:user"}
        error={errors.identifier?.message}
        register={register("identifier")}
        isTouched={touchedFields.identifier}
        isValid={!errors.identifier && touchedFields.identifier}
      ></CustomFormInput>
      <CustomFormInput
        placeholder="Contraseña"
        type="password"
        icon={"mdi:password"}
        error={errors.password?.message}
        register={register("password")}
        isTouched={touchedFields.password}
        isValid={!errors.password && touchedFields.password}
      ></CustomFormInput>
      {loginError && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
        >
          <p className="text-light-error">{loginError}</p>
        </motion.div>
      )}
      <div className="flex flex-col items-center gap-3 mt-3">
        <CustomButtonOne
          center
          full
          type="submit"
          color="secondary"
          icon={"stash:signin"}
          text="Iniciar Sesión"
          loading={isSubmitting}
          disabled={isGoogleLoading || isPending}
        />
        <div className="flex items-center w-full gap-5">
          <div className="w-1/2 h-[1px] bg-light-gray"></div>
          <span className="text-light-gray font-medium">O</span>
          <div className="w-1/2 h-[1px] bg-light-gray"></div>
        </div>
        <CustomButtonOne
          center
          full
          type="button"
          color="secondary"
          variant="outlined"
          disabled={isSubmitting}
          loading={isGoogleLoading || isPending}
          action={handleGoogleSignIn}
          icon={"uim:google"}
          text="Entrar con Google"
        />
      </div>
    </form>
  );
}
