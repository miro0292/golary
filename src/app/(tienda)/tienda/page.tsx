import { Clock, Mail, MapPin, MessageCircle, Phone, Store } from "lucide-react";
import PageHero from "@/components/PageHero";
import { STORE } from "@/lib/config";

export const metadata = { title: "Nuestra tienda" };

export default function StorePage() {
  return (
    <>
      <PageHero title="Nuestra tienda" text="Muy pronto abriremos nuestro primer local físico. ¡Te esperamos!" crumb="Nuestra tienda" accent="#00a8e8" />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-start gap-4 rounded-xl bg-brand-light p-6 dark:bg-ink-soft">
          <Store className="size-8 shrink-0 text-brand" />
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Nuestro primer local</h2>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              Estamos preparando la apertura. Aquí aparecerán la dirección, el horario y el mapa apenas estén listos.
            </p>
          </div>
        </div>

        <h2 className="mb-4 font-display text-xl font-bold uppercase text-gray-500 dark:text-gray-400">Mientras tanto, contáctanos aquí</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl p-6 ring-1 ring-gray-200 dark:ring-white/10">
            <MapPin className="size-8 text-brand" />
            <h3 className="mt-3 font-display text-2xl font-bold uppercase">Fábrica y oficina</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">{STORE.address}</p>
          </div>
          <div className="rounded-xl p-6 ring-1 ring-gray-200 dark:ring-white/10">
            <Phone className="size-8 text-brand" />
            <h3 className="mt-3 font-display text-2xl font-bold uppercase">Teléfonos</h3>
            <ul className="mt-1 space-y-0.5 text-gray-600 dark:text-gray-300">
              {STORE.phones.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="rounded-xl p-6 ring-1 ring-gray-200 dark:ring-white/10">
            <Mail className="size-8 text-brand" />
            <h3 className="mt-3 font-display text-2xl font-bold uppercase">Correo</h3>
            <p className="mt-1 break-all text-gray-600 dark:text-gray-300">{STORE.email}</p>
          </div>
          <div className="rounded-xl p-6 ring-1 ring-gray-200 dark:ring-white/10">
            <Clock className="size-8 text-brand" />
            <h3 className="mt-3 font-display text-2xl font-bold uppercase">Horario</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Lunes a sábado · 9:00 a.m. – 7:00 p.m. (por confirmar)</p>
          </div>
          <a
            href={`https://wa.me/${STORE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25d366] p-6 text-center font-bold uppercase text-white md:col-span-2"
          >
            <MessageCircle className="size-6" /> Escribir por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
