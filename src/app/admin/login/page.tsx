"use client";

import Image from "next/image";
import logo from "@/assets/logo-golary.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { DEMO_ADMIN, demoLogin } from "@/lib/admin/demo-auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoLogin(email, password)) router.replace("/admin");
    else setError(true);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ink p-4">
      <div className="w-full max-w-sm">
        <Image src={logo} alt="Golary" width={1211} height={392} className="mx-auto mb-6 h-16 w-auto" />
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-brand" />
            <h1 className="font-display text-2xl font-bold uppercase">Panel de administración</h1>
          </div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Correo" className="w-full rounded-lg px-4 py-3 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Contraseña" className="w-full rounded-lg px-4 py-3 ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand" />
          {error && <p className="text-sm font-semibold text-sale">Correo o contraseña incorrectos.</p>}
          <button className="w-full rounded-full bg-brand py-3 font-bold uppercase text-white hover:bg-brand-dark">Ingresar</button>
          <button
            type="button"
            onClick={() => { setEmail(DEMO_ADMIN.email); setPassword(DEMO_ADMIN.password); setError(false); }}
            className="w-full rounded-full py-2.5 text-sm font-semibold ring-1 ring-gray-300 hover:bg-gray-50"
          >
            Usar acceso de prueba
          </button>
          <p className="text-center text-xs text-gray-500">Prototipo: el acceso real con usuarios y roles llega al conectar la base de datos.</p>
        </form>
      </div>
    </div>
  );
}
