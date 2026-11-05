import PageHero from "@/components/PageHero";
import BallConfigurator from "@/components/configurator/BallConfigurator";

export const metadata = {
  title: "Personaliza tu balón",
  description: "Diseña tu propio balón Golary en 3D: elige un diseño base, sube tu logo y pide tu balón personalizado.",
};

export default function PersonalizePage() {
  return (
    <>
      <PageHero
        title="Personaliza tu balón"
        text="Gira el balón en 3D, elige un diseño base y sube tu logo o el escudo de tu equipo. Ideal para clubes, escuelas y empresas."
        crumb="Personaliza tu balón"
        accent="#7c5cff"
      />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <BallConfigurator />
      </div>
    </>
  );
}
