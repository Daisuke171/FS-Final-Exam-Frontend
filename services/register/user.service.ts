import { RegisterFormProps } from "@/types/register/RegisterFormProps";

export async function registerUser(payload: RegisterFormProps) {

const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al registrar");
  }

  return await res.json();
}
