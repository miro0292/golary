import Image from "next/image";
import logo from "@/assets/logo-golary.png";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-gray-300">
      <div className="bg-brand">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-white md:flex-row">
          <div>
            <p className="font-display text-2xl font-bold uppercase">Recibe ofertas y lanzamientos</p>
            <p className="text-sm text-white/85">Sé el primero en conocer nuestros nuevos balones.</p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input type="email" required placeholder="Tu correo electrónico" className="w-full rounded-full px-5 py-3 text-sm text-ink outline-none" />
            <button type="button" className="rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase text-white hover:bg-black">
              Suscribirme
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src={logo} alt="Golary" width={1211} height={392} className="h-12 w-auto" />
          <p className="mt-4 text-sm leading-relaxed">
            Fabricantes colombianos de balones y artículos deportivos. Calidad de fábrica directo a tu cancha.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-white">Deportes</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link className="hover:text-brand" href={`/categoria/${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-white">Ayuda</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-brand" href="/tienda">Nuestra tienda</Link></li>
            <li><Link className="hover:text-brand" href="/por-mayor">Clubes y por mayor</Link></li>
            <li><span>Envíos y entregas</span></li>
            <li><span>Cambios y garantía</span></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold uppercase text-white">Contacto</h3>
          <ul className="mt-3 space-y-3 text-sm">
            <li>
              <a className="flex items-center gap-2 hover:text-brand" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a className="flex items-center gap-2 hover:text-brand" href={`mailto:${STORE.email}`}>
                <Mail className="size-4" /> {STORE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Golary® · Tienda Deportiva · Hecho en Colombia ·{" "}
        <Link href="/admin" className="hover:text-brand">Administración</Link>
      </div>
    </footer>
  );
}
