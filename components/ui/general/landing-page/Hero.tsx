"use client";

import CustomButtonOne from "@/components/game/rock-paper-scissors/buttons/CustomButtonOne";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Hero() {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  return (
    <div className="h-screen relative">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet="/images/hero-bg.webp"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/images/hero-bg.webp"
        />
        <Image
          src="/images/hero-mobile-bg.webp"
          alt="Hero background"
          fill
          priority
          quality={85}
          className="object-cover"
          sizes="100vw"
        />
      </picture>
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/75  via-black/80 to-background"
      ></motion.div>
      <div className="absolute w-[90%] gap-4 lg:gap-5 flex flex-col lg:flex-row items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-75 md:w-80 lg:w-93"
        >
          <Image
            src="/images/hero-img.webp"
            alt="hero"
            width={600}
            height={600}
            loading="eager"
            priority
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="flex flex-col justify-center text-center items-center lg:text-left lg:items-start">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-transparent
                 tracking-wide text-clip bg-clip-text bg-gradient-to-r from-light-blue to-bright-purple max-w-[18ch]"
          >
            ¡Bienvenido a Sanya Games!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg md:text-xl text-font max-w-[50ch]"
          >
            Desafía a tus amigos, sube de nivel y gana recompensas. Juega
            minijuegos y demuestra quién manda.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col w-[90%] sm:w-fit sm:justify-center sm:flex-row gap-3 mt-6"
          >
            <CustomButtonOne
              text="Registrarse"
              color="white"
              full
              action={() => router.push("/register")}
              center
              icon={"tabler:user-up"}
            />
            <CustomButtonOne
              text="Iniciar Sesión"
              variant="outlined"
              color="white"
              center
              action={() => router.push("/login")}
              full
              icon={"material-symbols:login-rounded"}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
