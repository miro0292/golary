import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const barlow = Barlow({ variable: "--font-barlow", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const barlowCondensed = Barlow_Condensed({ variable: "--font-barlow-condensed", subsets: ["latin"], weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  title: { default: "Golary | Tienda Deportiva · Fabricantes de balones", template: "%s | Golary" },
  description:
    "Golary, fabricantes colombianos de balones de fútbol, futsal, voleibol, baloncesto y microfútbol. Compra directo de fábrica.",
  metadataBase: new URL("https://golary.co"),
  openGraph: { siteName: "Golary", locale: "es_CO", type: "website" },
  // La versión temporal (GitHub Pages) no debe aparecer en Google para no competir con golary.co.
  ...(process.env.NEXT_PUBLIC_NOINDEX === "1" ? { robots: { index: false, follow: false } } : {}),
};

// Antes de pintar nada, deja el tema correcto en <html> (elegido antes, o el del sistema).
// Así se evita el parpadeo de claro -> oscuro al cargar la página.
const themeScript = `(function(){try{var t=localStorage.getItem('golary-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} bg-white font-sans text-ink antialiased transition-colors duration-300 dark:bg-ink dark:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
