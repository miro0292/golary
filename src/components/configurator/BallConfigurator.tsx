"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useBallTexture, defaultLogoTransform, type LogoTransform } from "@/lib/configurator/useBallTexture";
import { getPreset, type PresetId } from "@/lib/configurator/presets";
import ControlPanel from "./ControlPanel";
import { STORE } from "@/lib/config";

// La escena usa WebGL (solo navegador): se carga sin SSR para evitar
// problemas al generar el sitio como estático.
const BallScene = dynamic(() => import("./BallScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-gray-400">Cargando el configurador 3D…</div>
  ),
});

const MAX_LOGO_MB = 5;

export default function BallConfigurator() {
  const [presetId, setPresetId] = useState<PresetId>("clasico");
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<LogoTransform>(defaultLogoTransform);
  const [spinning, setSpinning] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { texture } = useBallTexture(presetId, logo, transform);
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const handleUpload = useCallback((file: File) => {
    setError("");
    if (!/image\/(png|svg\+xml)/.test(file.type) && !/\.(png|svg)$/i.test(file.name)) {
      setError("Sube un archivo PNG o SVG.");
      return;
    }
    if (file.size > MAX_LOGO_MB * 1024 * 1024) {
      setError(`La imagen pesa más de ${MAX_LOGO_MB} MB, prueba con una más liviana.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setLogo(img);
        setTransform(defaultLogoTransform);
      };
      img.onerror = () => setError("No pudimos leer esa imagen, prueba con otro archivo.");
      img.src = reader.result as string;
    };
    reader.onerror = () => setError("No pudimos leer ese archivo.");
    reader.readAsDataURL(file);
  }, []);

  const handleTransform = useCallback((patch: Partial<LogoTransform>) => {
    setTransform((t) => ({ ...t, ...patch }));
  }, []);

  const handleSave = useCallback(() => {
    if (!canvasEl.current) return;
    setSaving(true);
    // Un pequeño respiro para que el frame actual (con el logo ya aplicado) se termine de pintar.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          const url = canvasEl.current!.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = url;
          a.download = `balon-golary-personalizado-${presetId}.png`;
          a.click();
          setSaved(true);
        } catch {
          setError("No se pudo generar la imagen. Si subiste un SVG con referencias externas, prueba exportarlo como PNG.");
        } finally {
          setSaving(false);
        }
      });
    });
  }, [presetId]);

  const handleOrder = useCallback(() => {
    const presetName = getPreset(presetId).name;
    const msg = encodeURIComponent(
      `Hola Golary, quiero cotizar un balón personalizado.\n` +
        `Diseño base: ${presetName}\n` +
        `Logo propio: ${logo ? "sí, lo adjunto por este chat" : "no, por ahora sin logo"}`,
    );
    window.open(`https://wa.me/${STORE.whatsapp}?text=${msg}`, "_blank", "noreferrer");
  }, [presetId, logo]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 lg:aspect-auto lg:min-h-[560px]">
        {texture && (
          <BallScene
            texture={texture}
            spinning={spinning}
            onReady={(c) => {
              canvasEl.current = c;
            }}
          />
        )}
        {saved && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/90 px-4 py-2 text-sm font-semibold text-white">
            <CheckCircle2 className="size-4 text-green-400" /> Imagen descargada
          </div>
        )}
      </div>

      <div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-sale dark:bg-red-500/10">{error}</p>
        )}
        <ControlPanel
          presetId={presetId}
          onPreset={setPresetId}
          hasLogo={!!logo}
          onUpload={handleUpload}
          onRemoveLogo={() => setLogo(null)}
          transform={transform}
          onTransform={handleTransform}
          spinning={spinning}
          onSpinning={setSpinning}
          onSave={handleSave}
          onOrder={handleOrder}
          saving={saving}
        />
      </div>
    </div>
  );
}
