"use client";
import useRegisterForm from "@/hooks/register/useRegisterForm";
import { Icon } from "@iconify/react";

export default function RegisterForm() {
  const { formData, handleChange, handleSubmit, error, success, loading } =
    useRegisterForm();

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mt-10 gap-6">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500 tracking-wide">
        REGISTRATE
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon icon="uil:user" width="28" className="text-indigo-400 mb-2" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon
            icon="mdi:account-outline"
            width="28"
            className="text-indigo-400 mb-2"
          />
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon
            icon="mdi:account-circle"
            width="28"
            className="text-indigo-400 mb-2"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuario"
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon icon="mdi:email" width="28" className="text-indigo-400 mb-2" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon icon="mdi:lock" width="28" className="text-indigo-400 mb-2" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>

        <div className="relative flex flex-col items-center bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-indigo-500/40 shadow-lg">
          <Icon
            icon="mdi:cake-variant"
            width="28"
            className="text-indigo-400 mb-2"
          />
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full bg-transparent text-white placeholder-gray-400 text-center focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:scale-[1.02] transition-transform disabled:opacity-60 shadow-lg"
        >
          {loading ? "REGISTRANDO..." : "REGISTRARSE"}
        </button>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-center text-sm">{success}</p>
        )}
      </form>
    </div>
  );
}
