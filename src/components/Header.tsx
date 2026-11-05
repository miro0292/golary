"use client";

import Image from "next/image";
import logo from "@/assets/logo-golary.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Menu, Search, ShoppingCart, User, X, ChevronRight, Facebook, Instagram, Youtube } from "lucide-react";
import { categories } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { STORE, formatCOP } from "@/lib/config";
import ThemeToggle from "./ThemeToggle";

const promos = [
  `Envío gratis en compras desde ${formatCOP(STORE.freeShippingFrom)}`,
  "Somos fabricantes: precio directo de fábrica",
  "¿Club, escuela o colegio? Pregunta por precios al por mayor",
];

// Redes sociales reales de Golary (tomadas de golary.co).
const SOCIAL = [
  { name: "X", href: "https://x.com/balones_golary", Icon: () => <span className="block text-[13px] font-bold leading-none">𝕏</span> },
  { name: "Facebook", href: "https://www.facebook.com/balonesgolary", Icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/balonesgolary", Icon: Instagram },
  { name: "YouTube", href: "https://youtube.com", Icon: Youtube },
];

const TOP_LINKS = [
  { label: "Home", href: "/" },
  { label: "Nuestra Empresa", href: "/#historia" },
  { label: "Productos", href: "/categoria/futbol" },
  { label: "Distribuidores", href: "/por-mayor" },
  { label: "Contacto", href: "/tienda" },
];

function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <form
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
        router.push(`/buscar?q=${encodeURIComponent(q)}`);
      }}
    >
      <input
        name="q"
        type="search"
        placeholder="Buscar balones, deportes…"
        className="w-full rounded-full bg-white py-2.5 pl-5 pr-12 text-sm text-ink outline-none ring-brand placeholder:text-gray-500 focus:ring-2"
      />
      <button aria-label="Buscar" className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-brand text-white hover:bg-brand-dark">
        <Search className="size-4" />
      </button>
    </form>
  );
}

export default function Header() {
  const { count, open } = useCart();
  const [promo, setPromo] = useState(0);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = setInterval(() => setPromo((p) => (p + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden items-center justify-between border-b border-white/10 bg-[#0a0b18] px-6 py-1.5 text-white lg:flex">
        <div className="flex items-center gap-3">
          {SOCIAL.map(({ name, href, Icon }) => (
            <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name} className="text-white/60 transition hover:text-brand">
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>
        <nav className="flex items-center gap-5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          {TOP_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="transition hover:text-white">{l.label}</Link>
          ))}
        </nav>
      </div>
      <div className="bg-brand text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
        <p key={promo} className="animate-[fadeIn_.4s_ease] px-4 py-2">{promos[promo]}</p>
      </div>

      <div className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button className="lg:hidden" aria-label="Abrir menú" onClick={() => setMenu(true)}>
            <Menu className="size-6" />
          </button>
          <Link href="/" className="shrink-0" aria-label="Golary inicio">
            <Image src={logo} alt="Golary Tienda Deportiva" width={1211} height={392} priority className="h-10 w-auto sm:h-12" />
          </Link>
          <SearchBox className="mx-auto hidden w-full max-w-xl md:block" />
          <nav className="ml-auto flex items-center gap-1 sm:gap-3 md:ml-0">
            <ThemeToggle compact className="shrink-0 ring-white/20 hover:bg-white/10" />
            <Link href="/tienda" className="hidden flex-col items-center px-2 text-[11px] hover:text-brand lg:flex">
              <MapPin className="size-5" /> Nuestra tienda
            </Link>
            <Link href="/login" className="flex flex-col items-center px-2 text-[11px] hover:text-brand">
              <User className="size-5" /> <span className="hidden sm:block">Mi cuenta</span>
            </Link>
            <button onClick={open} className="relative flex flex-col items-center px-2 text-[11px] hover:text-brand">
              <ShoppingCart className="size-5" /> <span className="hidden sm:block">Carrito</span>
              {count > 0 && (
                <span className="absolute -top-1.5 right-0 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </nav>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>
      </div>

      <nav className="hidden border-b border-gray-200 bg-white text-ink transition-colors duration-300 dark:border-white/10 dark:bg-ink-soft dark:text-white lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4 text-sm font-semibold uppercase tracking-wide">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categoria/${c.slug}`}
                className={`block border-b-2 px-3 py-3 transition hover:border-brand hover:text-brand ${
                  pathname === `/categoria/${c.slug}` ? "border-brand text-brand" : "border-transparent"
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
          <li><Link href="/ofertas" className="block px-3 py-3 text-sale hover:underline">Ofertas</Link></li>
          <li className="ml-auto"><Link href="/por-mayor" className="block rounded-full bg-ink px-4 py-1.5 text-xs text-white hover:bg-brand">Clubes y por mayor</Link></li>
        </ul>
      </nav>

      {/* Menú móvil */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? "" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${menu ? "opacity-100" : "opacity-0"}`} onClick={() => setMenu(false)} />
        <aside className={`absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white text-ink transition-transform dark:bg-ink-soft dark:text-white ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between bg-ink p-4">
            <Image src={logo} alt="Golary" width={1211} height={392} className="h-9 w-auto" />
            <button onClick={() => setMenu(false)} aria-label="Cerrar menú" className="text-white"><X /></button>
          </div>
          <ul className="divide-y divide-gray-100 font-semibold dark:divide-white/10">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="flex items-center justify-between px-5 py-4">
                  {c.name} <ChevronRight className="size-4 text-gray-400" />
                </Link>
              </li>
            ))}
            <li><Link href="/ofertas" className="block px-5 py-4 text-sale">Ofertas</Link></li>
            <li><Link href="/por-mayor" className="block px-5 py-4">Clubes y por mayor</Link></li>
            <li><Link href="/tienda" className="block px-5 py-4">Nuestra tienda</Link></li>
          </ul>
        </aside>
      </div>
    </header>
  );
}
