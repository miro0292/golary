"use client";

import Image from "next/image";
import logo from "@/assets/logo-golary.png";
import { useState } from "react";

// Pantalla de acceso (maqueta). En la Fase 2 se conecta a Supabase Auth.
export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "registro">("login");
  const [sent, setSent] = useState(false);

  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      <div className="hidden flex-col justify-center bg-ink p-12 text-white lg:flex">
        <Image src={logo} alt="Golary" width={1211} height={392} className="h-16 w-auto self-start" />
        <h2 className="mt-8 font-display text-5xl font-extrabold uppercase leading-none">Tu cuenta Golary</h2>
        <ul className="mt-6 space-y-2 text-white/80">
          <li>✓ Sigue tus pedidos</li>
          <li>✓ Guarda tus direcciones</li>
          <li>✓ Ofertas exclusivas para miembros</li>
        </ul>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 grid grid-cols-2 rounded-full bg-gray-100 p-1 text-sm font-bold uppercase dark:bg-white/5">
            {(["login", "registro"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setSent(false); }} className={`rounded-full py-2 ${tab === t ? "bg-white text-ink shadow dark:bg-white/15 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {t === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            {tab === "registro" && (
              <input required placeholder="Nombre completo" className="w-full rounded-lg px-4 py-3 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:text-white dark:ring-white/15" />
            )}
            <input required type="email" placeholder="Correo electrónico" className="w-full rounded-lg px-4 py-3 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:text-white dark:ring-white/15" />
            <input required type="password" placeholder="Contraseña" className="w-full rounded-lg px-4 py-3 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand dark:bg-white/5 dark:text-white dark:ring-white/15" />
            <button className="w-full rounded-full bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark">
              {tab === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-semibold text-ink ring-1 ring-gray-300 hover:bg-gray-50 dark:text-white dark:ring-white/15 dark:hover:bg-white/5">
              <span className="font-bold text-[#4285f4]">G</span> Continuar con Google
            </button>
            {sent && (
              <p className="rounded-lg bg-brand-light p-3 text-center text-sm text-ink dark:bg-ink-soft dark:text-white">
                Vista de prueba: el inicio de sesión se activará cuando conectemos la base de datos.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
