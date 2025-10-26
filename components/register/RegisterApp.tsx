"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomFormInput from "@/components/ui/inputs/CustomFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import { useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import FormTitle from "@/components/register/FormTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FruitSelector from "@/components/register/FruitSelector";
import { REGISTER_MUTATION } from "@/shared/graphql/queries/auth.mutations";
import { useMutation } from "@apollo/client/react";
import RegisterSuccess from "./RegisterSuccess";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "El campo es obligatorio")
      .max(16, "El campo es demasiado largo"),
    email: z.email("El correo es inválido"),
    username: z
      .string()
      .min(6, "Tu usuario debe tener al menos 6 caracteres")
      .max(10, "Tu usuario es demasiado largo")
      .refine(
        (val) => {
          const isUsername = /^(?!.*__)[a-zA-Z0-9_]+$/.test(val);
          return isUsername;
        },
        {
          message: "Debe ser un username valido",
        }
      ),
    lastname: z
      .string()
      .min(2, "El campo es obligatorio")
      .max(20, "El campo es demasiado largo"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(16, "La contraseña es demasiado larga")
      .refine(
        (val) => {
          const isPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(val);
          return isPassword;
        },
        {
          message:
            "La contraseña debe incluir mayúscula, minúscula, número y caracter especial",
        }
      ),
    passwordConfirmation: z.string().min(1, "El campo es obligatorio"),
    nickname: z
      .string()
      .min(6, "Tu usuario debe tener al menos 6 caracteres")
      .max(10, "Tu usuario es demasiado largo")
      .refine(
        (val) => {
          const isUsername = /^(?!.*__)[a-zA-Z0-9_]+$/.test(val);
          return isUsername;
        },
        {
          message: "Debe ser un username valido",
        }
      ),
    birthday: z.string().min(1, "El campo es obligatorio"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterApp() {
  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const router = useRouter();

  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting, touchedFields, isSubmitSuccessful },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const handleVerificationChange = useCallback((isVerified: boolean) => {
    setIsCaptchaVerified(isVerified);
    if (isVerified) {
      setCaptchaError(false);
    }
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    if (!isCaptchaVerified) {
      setCaptchaError(true);
      return;
    }
    if (error) {
      setRegisterError(error.message);
      return;
    }
    console.log("Datos recibidos:", data);
    try {
      const { data: response } = await registerUser({
        variables: {
          registerInput: {
            email: data.email,
            username: data.username,
            nickname: data.nickname,
            password: data.password,
            name: data.name,
            lastname: data.lastname,
            birthday: data.birthday,
          },
        },
      });

      console.log("✅ Registro exitoso:", response);
    } catch (err) {
      console.error("❌ Error en el registro:", err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let redirectTimer: NodeJS.Timeout | null = null;

    if (isSubmitSuccessful) {
      // 1. Iniciar el contador
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            if (timer) clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 3000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [isSubmitSuccessful, router]);

  if (isSubmitSuccessful) {
    return <RegisterSuccess countdown={countdown} />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="max-w-[95%] w-130 md:w-200  md:max-w-[600px] p-6 md:p-6 lg:p-8 rounded-2xl bg-white/7"
      >
        <FormTitle title="REGISTRATE" />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-6"
        >
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-3">
            <CustomFormInput
              icon={"material-symbols:mail-outline"}
              error={errors.email?.message}
              register={register("email")}
              isTouched={touchedFields.email}
              isValid={!errors.email && touchedFields.email}
              type="email"
              placeholder="Correo electrónico"
            />
            <CustomFormInput
              icon={"mdi:user-outline"}
              error={errors.username?.message}
              register={register("username")}
              isTouched={touchedFields.username}
              isValid={!errors.username && touchedFields.username}
              type="text"
              placeholder="Usuario"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-3">
            <CustomFormInput
              icon={"mdi:user-plus-outline"}
              error={errors.name?.message}
              register={register("name")}
              isTouched={touchedFields.name}
              isValid={!errors.name && touchedFields.name}
              type="text"
              placeholder="Nombre"
            />
            <CustomFormInput
              icon={"mdi:user-plus-outline"}
              error={errors.lastname?.message}
              register={register("lastname")}
              isTouched={touchedFields.lastname}
              isValid={!errors.lastname && touchedFields.lastname}
              type="text"
              placeholder="Apellido"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-3">
            <CustomFormInput
              icon={"mdi:user-plus-outline"}
              error={errors.nickname?.message}
              register={register("nickname")}
              isTouched={touchedFields.nickname}
              isValid={!errors.nickname && touchedFields.nickname}
              type="text"
              placeholder="Nickname"
            />
            <CustomFormInput
              icon={"material-symbols:cake-outline"}
              error={errors.birthday?.message}
              register={register("birthday")}
              isTouched={touchedFields.birthday}
              isValid={!errors.birthday && touchedFields.birthday}
              type="date"
              placeholder="Fecha de Nacimiento"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-3">
            <CustomFormInput
              icon={"material-symbols:lock-outline"}
              error={errors.password?.message}
              register={register("password")}
              isTouched={touchedFields.password}
              isValid={!errors.password && touchedFields.password}
              type="password"
              placeholder="Contraseña"
            />
            <CustomFormInput
              icon={"material-symbols:lock-outline"}
              error={errors.passwordConfirmation?.message}
              register={register("passwordConfirmation")}
              isTouched={touchedFields.passwordConfirmation}
              isValid={
                !errors.passwordConfirmation &&
                touchedFields.passwordConfirmation
              }
              type="password"
              placeholder="Confirmar Contraseña"
            />
          </div>
          <FruitSelector onVerificationChange={handleVerificationChange} />
          {captchaError && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="text-light-error text-center font-medium"
            >
              Por favor completa la verificación humana antes de registrarte
            </motion.div>
          )}
          {registerError && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
            >
              <p className="text-light-error">{registerError}</p>
            </motion.div>
          )}

          <div className="flex flex-col items-center gap-3 mt-3">
            <CustomButtonOne
              center
              full
              type="submit"
              color="secondary"
              icon={"stash:signin"}
              text="REGISTRARSE"
              loading={isSubmitting || loading}
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
              color="white"
              variant="outlined"
              icon={"uim:google"}
              text="Continuar con google"
            />
          </div>

          <div className="text-center mt-3 text-sm">
            <span className="text-subtitle">¿Ya tienes una cuenta? </span>
            <Link
              href="/login"
              className="font-bold text-shadow-blue hover:text-medium-blue transition-colors"
            >
              INICIA SESIÓN
            </Link>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
