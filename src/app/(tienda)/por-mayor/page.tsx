import { Palette, Package, Truck } from "lucide-react";
import PageHero from "@/components/PageHero";
import { STORE } from "@/lib/config";

export const metadata = {
  title: "Clubes y ventas al por mayor",
  description: "Balones personalizados con el escudo de tu club, escuela o empresa, directo de fábrica.",
};

export default function WholesalePage() {
  const msg = encodeURIComponent("Hola Golary, quiero cotizar balones al por mayor / personalizados.");
  return (
    <>
      <PageHero title="Clubes y por mayor" text="Balones personalizados y precios por volumen, directo de nuestra fábrica." crumb="Clubes y por mayor" accent="#00a8e8" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Palette, title: "Personalización", text: "Tu escudo, tus colores y tu nombre en el balón." },
            { icon: Package, title: "Precio por volumen", text: "Descuentos escalonados desde 12 unidades." },
            { icon: Truck, title: "Despacho nacional", text: "Enviamos a clubes y colegios de todo el país." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-gray-50 p-6">
              <Icon className="size-8 text-brand" />
              <h2 className="mt-3 font-display text-2xl font-bold uppercase">{title}</h2>
              <p className="mt-1 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={`https://wa.me/${STORE.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-brand px-10 py-4 font-bold uppercase text-white hover:bg-brand-dark">
            Solicitar cotización
          </a>
        </div>
      </div>
    </>
  );
}
