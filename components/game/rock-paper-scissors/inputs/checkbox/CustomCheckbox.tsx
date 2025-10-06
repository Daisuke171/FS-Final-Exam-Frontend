import { Icon } from "@iconify/react";
import React from "react";

interface CustomCheckboxProps {
  checked?: boolean;
  color?: "primary" | "secondary";
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = "md",
  className = "",
  id,
  color = "primary",
}) => {
  const primaryColor = "border-indigo-600 bg-indigo-600";
  const secondaryColor = "border-slate-600 bg-slate-600";

  const selectedColor = color === "primary" ? primaryColor : secondaryColor;
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`flex items-center gap-2 ${
        color === "primary" ? "text-indigo-950" : "text-slate-950"
      } ${className}`}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        id={id}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded border-2 
          transition-all duration-200 ease-in-out
          cursor-pointer
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : color === "primary"
              ? "hover:border-indigo-800 hover:bg-indigo-800"
              : "hover:border-slate-800 hover:bg-slate-800"
          }
          ${checked ? selectedColor : "bg-white border-slate-300"}
          focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            color === "primary"
              ? "focus:ring-indigo-500"
              : "focus:ring-slate-500"
          }
        `}
      >
        {checked && (
          <Icon
            icon="material-symbols:check"
            width={iconSizes[size]}
            className="text-white"
          />
        )}
      </div>
      {label && (
        <label
          htmlFor={id}
          onClick={handleClick}
          className={`
            select-none
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${
              size === "sm"
                ? "text-sm"
                : size === "lg"
                ? "text-lg"
                : "text-base"
            }
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CustomCheckbox;
