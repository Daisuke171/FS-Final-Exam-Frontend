import React, { useState, useCallback } from "react";
import {
  Mail,
  Lock,
  User,
  LoaderCircle,
  Cake,
  UserPlus,
  ArrowLeft,
} from "lucide-react"; // Añadimos ArrowLeft

import useRegisterForm from "@/hooks/register/useRegisterForm";
import FormTitle from "./FormTitle";
import InputGroup from "./InputGroup";
import FruitSelector from "./FruitSelector";
import Link from "next/link";
import Image from "next/image";

export default function RegisterApp() {
  const { formData, handleChange, handleSubmit, error, success, loading } =
    useRegisterForm();

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleVerificationChange = useCallback((isVerified: boolean) => {
    setIsCaptchaVerified(isVerified);
  }, []);

  const buttonDisabled = loading || !isCaptchaVerified;

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-white p-2">
      <div className="relative w-full max-w-sm md:max-w-lg mt-6 p-4 sm:p-5 md:p-6 rounded-2xl bg-gray-800/60 shadow-[0_0_40px_rgba(0,0,0,0.5),_0_0_80px_rgba(50,100,250,0.3)] border border-indigo-700/50">
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 rounded-full text-indigo-400 hover:text-cyan-400 transition hover:bg-white/5"
          aria-label="Volver a la página principal"
        >
          <ArrowLeft size={24} />
        </Link>

        <FormTitle title="REGISTRATE" />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col md:flex-row md:gap-5">
            {/* COLUMNA 1 */}
            <div className="flex flex-col gap-3 w-full md:w-1/2">
              <InputGroup
                icon={Mail}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
              />
              <InputGroup
                icon={User}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
              />
              <InputGroup
                icon={Lock}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
              />
            </div>

            {/* COLUMNA 2 */}
            <div className="flex flex-col gap-3 w-full md:w-1/2 mt-3 md:mt-0">
              <InputGroup
                icon={UserPlus}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
              />
              <InputGroup
                icon={UserPlus}
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Apellido"
              />
              <InputGroup
                icon={Cake}
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                placeholder="Fecha de Nacimiento"
              />
            </div>
          </div>

          <FruitSelector onVerificationChange={handleVerificationChange} />

          <button
            type="submit"
            disabled={buttonDisabled}
            className={`w-full py-2.5 rounded-xl font-bold text-white transition-all duration-300 shadow-lg 
                            ${
                              buttonDisabled
                                ? "opacity-50 cursor-not-allowed bg-gray-600"
                                : "bg-gradient-to-r from-pink-500 to-cyan-500 hover:scale-[1.02] shadow-pink-500/30 hover:shadow-cyan-500/50"
                            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center text-sm">
                <LoaderCircle
                  size={18}
                  className="animate-spin mr-2"
                />{" "}
                REGISTRANDO
              </span>
            ) : (
              "REGISTRARSE"
            )}
          </button>

          <div className="flex items-center my-1">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xs">O</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl font-bold text-gray-300 bg-white/5 border border-gray-700 hover:bg-white/10 transition flex items-center justify-center shadow-inner shadow-gray-700/50"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_Google_g_color.svg"
              alt="Logo de Google"
              className="w-4 h-4 mr-2"
            />
            <span className="text-sm">Continuar con Google</span>
          </button>

          <div className="text-center mt-3 text-xs">
            {error && <p className="text-red-400 text-center mb-1">{error}</p>}
            {success && (
              <p className="text-green-400 text-center mb-1">{success}</p>
            )}

            <span className="text-gray-500">¿Ya tienes una cuenta? </span>
            <a
              href="#"
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              INICIA SESIÓN
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
