"use client";

import { useRef } from "react";
import { Download, MessageCircle, RotateCw, Trash2, Upload } from "lucide-react";
import { presets, type PresetId } from "@/lib/configurator/presets";
import type { LogoTransform } from "@/lib/configurator/useBallTexture";

type Props = {
  presetId: PresetId;
  onPreset: (id: PresetId) => void;
  hasLogo: boolean;
  onUpload: (file: File) => void;
  onRemoveLogo: () => void;
  transform: LogoTransform;
  onTransform: (t: Partial<LogoTransform>) => void;
  spinning: boolean;
  onSpinning: (v: boolean) => void;
  onSave: () => void;
  onOrder: () => void;
  saving: boolean;
};

const sliderCls =
  "w-full accent-brand [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand";

export default function ControlPanel({
  presetId,
  onPreset,
  hasLogo,
  onUpload,
  onRemoveLogo,
  transform,
  onTransform,
  spinning,
  onSpinning,
  onSave,
  onOrder,
  saving,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      {/* 1. Logo */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink dark:text-white">1. Tu logo</h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/svg+xml,.png,.svg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand dark:border-white/20 dark:text-white"
          >
            <Upload className="size-4" /> {hasLogo ? "Cambiar logo (PNG o SVG)" : "Subir logo (PNG o SVG)"}
          </button>
          {hasLogo && (
            <button
              type="button"
              onClick={onRemoveLogo}
              aria-label="Quitar logo"
              className="grid size-11 shrink-0 place-items-center rounded-lg ring-1 ring-gray-300 hover:bg-gray-50 dark:ring-white/15 dark:hover:bg-white/5"
            >
              <Trash2 className="size-4" />
            </button>
          )}
        </div>
      </section>

      {/* 2. Diseño base */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink dark:text-white">2. Diseño base</h2>
        <div className="grid grid-cols-5 gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPreset(p.id)}
              title={p.name}
              className={`flex flex-col items-center gap-1 rounded-lg p-1.5 ring-2 transition ${
                presetId === p.id ? "ring-brand" : "ring-transparent hover:ring-gray-300 dark:hover:ring-white/20"
              }`}
            >
              <span className="size-9 rounded-full ring-1 ring-black/10" style={{ background: p.swatch }} />
              <span className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-ink dark:text-white">{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Posición del logo */}
      <section className={hasLogo ? "" : "pointer-events-none opacity-40"}>
        <h2 className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-ink dark:text-white">
          3. Ajustar el logo
        </h2>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Posición horizontal</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={transform.x} onChange={(e) => onTransform({ x: Number(e.target.value) })} className={sliderCls} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Posición vertical</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={transform.y} onChange={(e) => onTransform({ y: Number(e.target.value) })} className={sliderCls} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Tamaño</span>
            </div>
            <input type="range" min={0.06} max={0.6} step={0.01} value={transform.scale} onChange={(e) => onTransform({ scale: Number(e.target.value) })} className={sliderCls} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Rotación</span>
            </div>
            <input type="range" min={0} max={360} step={1} value={transform.rotation} onChange={(e) => onTransform({ rotation: Number(e.target.value) })} className={sliderCls} />
          </div>
        </div>
      </section>

      {/* Giro automático */}
      <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 text-sm font-semibold text-ink dark:bg-white/5 dark:text-white">
        <span className="flex items-center gap-2"><RotateCw className="size-4 text-brand" /> Girar automáticamente</span>
        <input type="checkbox" checked={spinning} onChange={(e) => onSpinning(e.target.checked)} className="size-4 accent-brand" />
      </label>

      {/* Guardar / pedir */}
      <div className="space-y-2 border-t border-gray-200 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-bold uppercase text-white hover:bg-black disabled:opacity-60 dark:bg-white dark:text-ink dark:hover:bg-gray-200"
        >
          <Download className="size-4" /> {saving ? "Generando…" : "Guardar diseño"}
        </button>
        <button
          type="button"
          onClick={onOrder}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] py-3 text-sm font-bold uppercase text-white hover:brightness-95"
        >
          <MessageCircle className="size-4" /> Pedir este diseño por WhatsApp
        </button>
        <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
          Prototipo: &quot;Guardar diseño&quot; descarga una imagen de tu balón. Como todavía no hay pagos en línea para balones
          personalizados, el pedido se envía por WhatsApp.
        </p>
      </div>
    </div>
  );
}
