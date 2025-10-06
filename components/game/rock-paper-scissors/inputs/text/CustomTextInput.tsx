import { Icon } from "@iconify/react";

interface CustomTextInputProps {
  action: () => void;
  placeholder?: string;
  name?: string;
  icon: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary";
}

export default function CustomTextInput({
  action,
  placeholder,
  name,
  icon,
  size = "md",
  color = "primary",
}: CustomTextInputProps) {
  const SelectedSize =
    size === "sm" ? "py-2 px-3" : size === "md" ? "py-3 px-4" : "py-4 px-5";
  return (
    <div className="border-2 w-full rounded-xl flex border-slate-600 group transition-all focus-within:border-indigo-500 relative">
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        className={` placeholder:text-slate-500 rounded-xl w-full ${SelectedSize} pr-14 focus:outline-none text-slate-900`}
      />

      <Icon
        icon={icon}
        width={25}
        onClick={action}
        className={`absolute right-0 top-1/2 transform transition-all -translate-y-1/2 ${
          size === "sm" ? "p-2" : size === "md" ? "p-3" : "p-4"
        } text-slate-600 group-focus-within:text-indigo-500 hover:text-indigo-600 cursor-pointer`}
      />
    </div>
  );
}
