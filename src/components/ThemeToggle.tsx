"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({
  className = "ring-white/20 hover:bg-white/10",
  compact = false,
}: {
  // Colores del anillo y el hover: pásalos según el fondo donde quede el botón
  // (en una barra siempre oscura, los de por defecto; en una barra que cambia
  // con el tema, algo como "ring-gray-300 hover:bg-gray-100 dark:ring-white/15 dark:hover:bg-white/5").
  className?: string;
  compact?: boolean;
}) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={`flex items-center gap-2 rounded-full ring-1 transition ${
        compact ? "size-9 justify-center" : "px-3 py-2 text-[11px] font-semibold uppercase"
      } ${className}`}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {!compact && <span>{isDark ? "Claro" : "Oscuro"}</span>}
    </button>
  );
}
