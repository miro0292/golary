import { Clock, MapPin, MessageCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { STORE } from "@/lib/config";

export const metadata = { title: "Nuestra tienda" };

export default function StorePage() {
  return (
    <>
      <PageHero title="Nuestra tienda" text="Muy pronto abriremos nuestro primer local. ¡Te esperamos!" crumb="Nuestra tienda" accent="#00a8e8" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        {[
          { icon: MapPin, title: "Dirección", text: "Próximamente — aquí irá la dirección y el mapa de Google." },
          { icon: Clock, title: "Horario", text: "Lunes a sábado · 9:00 a.m. – 7:00 p.m. (por confirmar)" },
          { icon: MessageCircle, title: "Escríbenos", text: "Atención y pedidos por WhatsApp." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl p-6 ring-1 ring-gray-200 dark:ring-white/10">
            <Icon className="size-8 text-brand" />
            <h2 className="mt-3 font-display text-2xl font-bold uppercase">{title}</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-300">{text}</p>
          </div>
        ))}
        <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer" className="rounded-full bg-[#25d366] py-3 text-center font-bold uppercase text-white md:col-start-2">
          Escribir por WhatsApp
        </a>
      </div>
    </>
  );
}
