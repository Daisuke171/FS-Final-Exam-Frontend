"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  full?: boolean;
}

export default function CustomSelect({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue,
  full = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.find((opt) => opt.value === defaultValue) || null
  );

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className={`relative ${full ? "w-full" : "w-48"}`}>
      {/* Select button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center bg-white/7 backdrop-blur-md  text-font px-4 py-2 rounded-xl hover:bg-white/10 transition"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-full bg-white/7 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-50 "
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-2 cursor-pointer hover:bg-white/10 ${
                  selected?.value === opt.value
                    ? "bg-shadow-blue pointer-events-none"
                    : ""
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
