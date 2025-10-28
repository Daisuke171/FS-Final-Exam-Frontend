import React from "react";

interface FormTitleProps {
  title: string;
}

export default function FormTitle({ title }: FormTitleProps) {
  return (
    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-500 tracking-wide text-center">
      {title}
    </h1>
  );
}
