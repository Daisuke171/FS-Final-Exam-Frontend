import React, { useState } from "react";

type RegisterFormProps = {
    name: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    birthday: string;
};

async function registerUser(data: RegisterFormProps) {
    console.log("Datos a enviar:", data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.password.length < 6) {
                reject(new Error("La contraseña debe tener al menos 6 caracteres."));
            } else {
                resolve({ success: true });
            }
        }, 1500);
    });
}

export default function useRegisterForm() {
    const [formData, setFormData] = useState<RegisterFormProps>({
        name: "", lastname: "", username: "", email: "", password: "", birthday: "",
    } as RegisterFormProps);

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
            setFormData({ name: "", lastname: "", email: "", username: "", password: "", birthday: "", } as RegisterFormProps);
        } catch (err: any) {
            const errorMessage = err.message || "Error desconocido durante el registro.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, error, success, loading };
}