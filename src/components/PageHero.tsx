import Link from "next/link";

export default function PageHero({ title, text, crumb, accent = "#0b0b0c" }: { title: string; text?: string; crumb: string; accent?: string }) {
  return (
    <section className="text-white" style={{ background: `linear-gradient(110deg, #0b0b0c 40%, ${accent})` }}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-2 text-xs text-white/70">
          <Link href="/" className="hover:underline">Inicio</Link> / <span>{crumb}</span>
        </nav>
        <h1 className="font-display text-4xl font-extrabold uppercase md:text-5xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-white/80">{text}</p>}
      </div>
    </section>
  );
}
