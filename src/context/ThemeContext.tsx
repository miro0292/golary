"use client";

// Tema claro/oscuro del sitio. Mantiene los mismos colores corporativos
// (azul, negro, blanco): en modo oscuro las superficies claras pasan a
// tonos de "ink" y el texto se aclara; el azul de marca no cambia.
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "golary-theme";

type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // El script en <head> (ver layout.tsx) ya dejó el atributo correcto antes del primer pintado.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setThemeState(current === "dark" ? "dark" : "light");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark"), setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return c;
}
