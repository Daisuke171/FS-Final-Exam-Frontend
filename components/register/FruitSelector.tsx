import React, { useState, useEffect, useMemo } from "react";
import { Apple, Grape, Circle, CheckCircle } from "lucide-react";

interface FruitSelectorProps {
  onVerificationChange: (isVerified: boolean) => void;
}

type FruitOption = {
  id: string;
  type: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  name: string;
};

export default function FruitSelector({
  onVerificationChange,
}: FruitSelectorProps) {
  const CLASE_FONDO_ITEM = "bg-white/10 backdrop-blur-sm";

  const FRUIT_OPTIONS: FruitOption[] = useMemo(
    () => [
      {
        id: "1",
        type: "Grape",
        icon: Grape,
        color: "text-sky-300",
        bg: CLASE_FONDO_ITEM,
        name: "Uva Morada",
      },
      {
        id: "2",
        type: "Lemon",
        icon: Circle,
        color: "text-yellow-300",
        bg: CLASE_FONDO_ITEM,
        name: "Limón Amarillo",
      },
      {
        id: "3",
        type: "Apple",
        icon: Apple,
        color: "text-red-300",
        bg: CLASE_FONDO_ITEM,
        name: "Manzana Roja",
      },
      {
        id: "4",
        type: "Grape",
        icon: Grape,
        color: "text-indigo-300",
        bg: CLASE_FONDO_ITEM,
        name: "Uva Verde",
      },
    ],
    [CLASE_FONDO_ITEM]
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (selectedItems.length === 2 && !isVerified) {
      const [id1, id2] = selectedItems;
      const fruit1 = FRUIT_OPTIONS.find((f) => f.id === id1);
      const fruit2 = FRUIT_OPTIONS.find((f) => f.id === id2);

      let isCorrect = false;

      if (fruit1 && fruit2) {
        isCorrect = fruit1.type === fruit2.type && fruit1.id !== fruit2.id;
      }

      setIsVerified(isCorrect);

      if (typeof onVerificationChange === "function") {
        onVerificationChange(isCorrect);
      }

      if (!isCorrect) {
        setTimeout(() => {
          setSelectedItems([]);
        }, 1000);
      }
    }
  }, [selectedItems, isVerified, onVerificationChange, FRUIT_OPTIONS]);

  const handleSelect = (itemId: string) => {
    if (isVerified) return;

    if (selectedItems.includes(itemId)) {
      setSelectedItems((prev) => prev.filter((item) => item !== itemId));
      return;
    }

    setSelectedItems((prev) => {
      if (prev.length < 2) {
        return [...prev, itemId];
      }
      return prev;
    });
  };

  // Componente Item de Fruta
  const FruitItem: React.FC<{ fruit: FruitOption }> = React.memo(
    ({ fruit }) => {
      const isSelected = selectedItems.includes(fruit.id);

      let borderColor = "border-white/10";

      if (isVerified && isSelected) {
        borderColor = "border-green-500 ring-2 ring-green-500";
      } else if (selectedItems.length === 2 && !isVerified && isSelected) {
        borderColor = "border-red-500 ring-2 ring-red-500";
      } else if (isSelected) {
        // Sky-200 para selección
        borderColor = "border-sky-200 ring-2 ring-sky-200/80";
      }

      return (
        <div
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-xl ${fruit.bg} ${borderColor} cursor-pointer transition transform hover:scale-105 active:scale-95 
                            hover:shadow-[0_0_10px_theme(colors.sky.300)]`} // Más glow al hacer hover
          onClick={() => handleSelect(fruit.id)}
        >
          <fruit.icon
            size={28}
            className={fruit.color}
          />
        </div>
      );
    }
  );

  FruitItem.displayName = "FruitItem";

  return (
    <div
      className="w-full my-4 flex flex-col items-center p-3 rounded-2xl 
                    bg-blue-900/30 border border-sky-100/50 
                     shadow-sky-500/10 
                    shadow-[0_0_40px_theme(colors.cyan.400/80)] transition duration-500"
    >
      <p className="text-gray-400 text-xs mb-3 text-center font-semibold">
        {isVerified ? (
          <span className="text-green-400 flex items-center justify-center hover-blue-glow">
            <CheckCircle
              size={16}
              className="mr-1"
            />{" "}
            ¡Verificación Humana Exitosa!
          </span>
        ) : (
          `Para registrarte, selecciona el par de frutas iguales.`
        )}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mx-auto">
        {FRUIT_OPTIONS.map((fruit) => (
          <FruitItem
            key={fruit.id}
            fruit={fruit}
          />
        ))}
      </div>
    </div>
  );
}
