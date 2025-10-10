"use client";
import useRegisterForm from "@/hooks/register/useRegisterForm";
import { div, h1 } from "motion/react-client";

export default function RegisterForm() {
  const { formData, handleChange, handleSubmit, error, success, loading } =
    useRegisterForm();

  return (
    <>
      <h1>REGISTRATE</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Apellido"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
        />
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "REGISTRANDO..." : "REGISTRARSE"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </form>
    </>
  );
}
