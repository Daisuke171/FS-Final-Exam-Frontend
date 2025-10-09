import { RegisterFormProps } from "@/types/register/RegisterFormProps";

export async function registerUser(payload: RegisterFormProps) {

    const res = await fetch('http://localhost:3000/user/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

if (!res.ok) {
  const error = await res.json()
  throw new Error(error.message || 'Error al registrar')
}

return await res.json()

}