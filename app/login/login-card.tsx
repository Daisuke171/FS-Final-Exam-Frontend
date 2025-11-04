"use client";

import Link from "next/link";
import LoginForm from "./login-form";
import { AnimatePresence, motion } from "motion/react";
import FormTitle from "@/components/register/FormTitle";
import Image from "next/image";

export default function LoginCard() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex justify-center w-full items-center lg:items-stretch lg:max-w-[95%]"
      >
        <div className="max-w-130 rounded-l-2xl hidden lg:block">
          <Image
            src="/images/login-image.webp"
            alt="Login image"
            width={700}
            height={700}
            priority
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>
        <div className="p-6 py-8 md:p-8 lg:p-10 bg-white/7 rounded-2xl lg:rounded-l-none lg:rounded-r-2xl w-130 max-w-[95%] backdrop-blur-md">
          <FormTitle title="INICIA SESIÓN" />
          <p className="text-subtitle">
            Ingresa a tu cuenta para subir de nivel y empezar a ganar
            recompenzas
          </p>
          <LoginForm />
          <div className="text-center mt-6 text-sm">
            <span className="text-subtitle">¿No tienes cuenta aún? </span>
            <Link
              href="/register"
              className="font-bold text-shadow-blue hover:text-medium-blue transition-colors"
            >
              REGISTRATE
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
