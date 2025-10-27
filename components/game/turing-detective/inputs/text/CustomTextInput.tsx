import { Icon } from "@iconify-icon/react";

interface CustomTextInputProps {
  action?: () => void;
  placeholder?: string;
  name?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  type?: "text" | "password";
}

export default function CustomTextInput({
  action,
  placeholder,
  name,
  icon,
  type = "text",
  size = "md",
}: CustomTextInputProps) {
  const SelectedSize =
    size === "sm" ? "py-2 px-3" : size === "md" ? "py-3 px-4" : "py-4 px-5";
  return (
    <div className="border-2 w-full rounded-xl flex border-light-gray group transition-all focus-within:border-hover-purple relative">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={` placeholder:text-light-gray rounded-xl w-full ${SelectedSize} ${
          icon && "pr-16"
        } focus:outline-none text-font`}
      />

      {icon && (
        <Icon
          icon={icon}
          width={25}
          onClick={action}
          className={`absolute right-0 top-1/2 transform transition-all -translate-y-1/2 ${
            size === "sm" ? "p-2" : size === "md" ? "p-3" : "p-4"
          } text-hover-gray group-focus-within:text-light-purple hover:text-hover-purple cursor-pointer`}
        />
      )}
    </div>
  );
}
