import { useState } from "react";
import { registerUser } from "@/services/register/user.service";
import { RegisterFormProps } from "@/types/register/RegisterFormProps";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormProps>({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    birthday: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess("Usuario registrado correctamente");
      setFormData({
        name: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        birthday: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { formData, handleChange, handleSubmit, error, success, loading };
}
