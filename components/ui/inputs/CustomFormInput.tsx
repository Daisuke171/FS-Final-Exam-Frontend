"use client";

import { Icon, IconifyIcon } from "@iconify/react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";

interface CustomFormInputProps {
  placeholder?: string;
  type?: string;
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  isTouched?: boolean;
  isValid?: boolean;
  name?: string;
  icon?: IconifyIcon | string;
}

export default function CustomFormInput({
  placeholder,
  type,
  label,
  error,
  register,
  isTouched,
  isValid,
  name,
  icon,
}: CustomFormInputProps) {
  const borderColor = error
    ? "border-light-error"
    : isTouched && isValid
    ? "border-success"
    : "border-light-gray";

  const iconColor = error
    ? "text-light-error"
    : isTouched && isValid
    ? "text-success"
    : "text-light-gray";
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex flex-col gap-2 relative">
      {label && <label className="text-font">{label}</label>}
      <div className="relative group">
        <input
          {...register}
          name={name}
          type={type === "password" ? (clicked ? "text" : "password") : type}
          placeholder={placeholder}
          className={`py-3 px-4 border-2 ${borderColor} ${
            icon && "pl-11"
          } rounded-xl w-full focus:outline-none
            focus:border-light-blue  text-font transition duration-300 ease-in-out`}
        />
        {type === "password" && (
          <Icon
            icon={`${clicked ? "solar:eye-linear" : "solar:eye-closed-linear"}`}
            width="24"
            onClick={() => setClicked(!clicked)}
            className={`absolute right-5 cursor-pointer ${
              clicked ? "top-1/2" : "top-7.5"
            } transform -translate-y-1/2 text-light-gray`}
          />
        )}
        {icon && (
          <Icon
            icon={icon}
            width="24"
            className={`absolute left-3 top-1/2 transform transition duration-300 ease-in-out -translate-y-1/2 ${iconColor} group-focus-within:text-light-blue`}
          />
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <p className="text-light-error">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
