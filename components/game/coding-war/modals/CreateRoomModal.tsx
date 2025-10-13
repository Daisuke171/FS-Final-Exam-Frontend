"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getSocket } from "@/app/socket";
import { Icon } from "@iconify-icon/react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import CustomButtonOne from "../buttons/CustomButtonOne";
import CustomCheckbox from "../inputs/checkbox/CustomCheckbox";

const formSchema = z
  .object({
    roomName: z
      .string()
      .min(4, "Room name must be at least 4 characters")
      .max(10, "Room name must be at most 10 characters"),
    isPrivate: z.boolean(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password must be at most 20 characters")
      .optional(),
  })
  .refine(
    (data) => !data.isPrivate || (data.password && data.password.length >= 4),
    { message: "Password is required for private rooms", path: ["password"] }
  );

type FormData = z.infer<typeof formSchema>;

const socket = getSocket();

export default function CreateRoomModal({
  setCloseModal,
}: {
  setCloseModal: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    roomName: "",
    isPrivate: false,
    password: undefined,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    socket.on("roomCreated", (data: { roomInfo?: unknown; roomId: string }) => {
      console.log("Sala creada:", data.roomInfo);
      setLoading(false);
      setCloseModal();
  router.push(`/games/coding-war/${data.roomId}`);
    });

    return () => {
      socket.off("roomCreated");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const result = formSchema.safeParse(formData);
    if (result.success) {
      socket.emit("createRoom", {
        roomName: formData.roomName,
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : undefined,
      });
    } else {
      const fieldErrors: { [key: string]: string } = {};

      result.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        fieldErrors[field] = err.message;
      });
      setLoading(false);
      setErrors(fieldErrors);
    }
  };

  const handleInputChange = (
    field: keyof FormData | string,
    value: string | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="glass-box-one fixed p-10 top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 w-130"
      >
        <Icon
          icon="material-symbols:close"
          width={30}
          className="absolute top-4 right-4 cursor-pointer hover:text-shadow-blue transition-all"
          onClick={setCloseModal}
        />
        <h2 className="text-4xl font-bold text-font">Crea tu sala</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5 w-full justify-center"
        >
          <div className="w-full">
            <input
              type="text"
              placeholder="Nombre de la sala"
              onChange={(e) => handleInputChange("roomName", e.target.value)}
              className="placeholder:text-light-gray w-full py-4 px-6 focus:border-hover-purple rounded-xl border-2 border-light-gray focus:outline-none text-font"
            />
            {errors.roomName && (
              <p className="text-error mt-2">{errors.roomName}</p>
            )}
          </div>
          <AnimatePresence>
            {formData.isPrivate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                className="w-full"
              >
                <input
                  type="password"
                  placeholder="Contraseña"
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="placeholder:text-light-gray w-full py-4 px-6 focus:border-hover-purple rounded-xl border-2 border-light-gray focus:outline-none text-font"
                />
                {errors.password && (
                  <p className="text-error mt-2">{errors.password}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <CustomCheckbox
            checked={formData.isPrivate}
            onChange={(checked) => handleInputChange("isPrivate", checked)}
            label="Sala privada"
          />
          <CustomButtonOne
            icon={"material-symbols:check-circle-outline"}
            text="Confirmar"
            type="submit"
            loading={loading}
          />
        </form>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 w-full h-full bg-black/50"
        onClick={setCloseModal}
      ></motion.div>
    </>
  );
}
