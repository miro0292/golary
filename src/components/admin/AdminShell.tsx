"use client";

import Image from "next/image";
import logo from "@/assets/logo-golary.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Boxes, ExternalLink, LayoutDashboard, LogOut, Menu, Package, Receipt, RotateCcw, X } from "lucide-react";
import { demoLogout, demoSession } from "@/lib/admin/demo-auth";
import { useAdmin } from "@/context/AdminStore";

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/ventas/nueva", label: "Registrar venta", icon: Receipt, highlight: true },
  { href: "/admin/ventas", label: "Ventas", icon: Receipt },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, resetDemo } = useAdmin();
  const [user, setUser] = useState<{ name: string; email: string } | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    const s = demoSession();
    setUser(s);
    if (!s && !isLogin) router.replace("/admin/login");
  }, [pathname, isLogin, router]);
  useEffect(() => setOpen(false), [pathname]);

  if (isLogin) return <>{children}</>;
  if (!user || !ready) return <div className="grid min-h-screen place-items-center bg-gray-100 text-gray-500">Cargando…</div>;

  // La opción activa es la ruta más específica que coincide con la URL actual.
  const current = nav
    .map((n) => n.href)
    .filter((h) => pathname === h || pathname.startsWith(h + "/"))
    .sort((a, b) => b.length - a.length)[0];
  const active = (href: string) => href === current;

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-gray-300">
      <div className="flex items-center justify-between p-5">
        <Link href="/admin"><Image src={logo} alt="Golary" width={1211} height={392} className="h-10 w-auto" /></Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map(({ href, label, icon: Icon, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              active(href) ? "bg-brand text-white" : highlight ? "text-brand hover:bg-white/5" : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-5" /> {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3 text-sm">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"><ExternalLink className="size-4" /> Ver tienda</Link>
        <button
          onClick={() => confirm("¿Restablecer los datos de prueba? Se perderán los cambios hechos en este navegador.") && resetDemo()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5"
        >
          <RotateCcw className="size-4" /> Restablecer datos de prueba
        </button>
        <button onClick={() => { demoLogout(); router.replace("/admin/login"); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">{sidebar}</aside>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-64 transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
      </div>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
          <span className="rounded bg-yellow-100 px-2 py-0.5 text-[11px] font-bold uppercase text-yellow-800">Modo prueba</span>
          <div className="ml-auto text-right text-sm">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
