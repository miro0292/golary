"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getPreset, type PresetId } from "./presets";

export type LogoTransform = {
  x: number; // 0-1, centro horizontal sobre la textura
  y: number; // 0-1, centro vertical sobre la textura
  scale: number; // 0.05-0.6, tamaño relativo al ancho de la textura
  rotation: number; // grados
};

export const defaultLogoTransform: LogoTransform = { x: 0.5, y: 0.5, scale: 0.22, rotation: 0 };

const TEXTURE_SIZE = 1024;

/**
 * Dibuja el diseño base elegido y, encima, el logo del usuario (si hay uno),
 * en un <canvas> 2D que se usa como textura del balón. Cambiar el diseño
 * base NUNCA mueve el logo: ambos se redibujan juntos cada vez, con la
 * posición del logo guardada aparte en `transform`.
 */
export function useBallTexture(presetId: PresetId, logo: HTMLImageElement | null, transform: LogoTransform) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (!canvasRef.current && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = TEXTURE_SIZE;
    c.height = TEXTURE_SIZE;
    canvasRef.current = c;
  }
  const canvas = canvasRef.current;

  const texture = useMemo(() => {
    if (!canvas) return null;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [canvas]);

  useEffect(() => {
    if (!canvas || !texture) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    getPreset(presetId).draw(ctx, TEXTURE_SIZE);

    if (logo) {
      ctx.save();
      const cx = transform.x * TEXTURE_SIZE;
      const cy = transform.y * TEXTURE_SIZE;
      const w = transform.scale * TEXTURE_SIZE;
      const h = w * (logo.height / logo.width || 1);
      ctx.translate(cx, cy);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.drawImage(logo, -w / 2, -h / 2, w, h);
      ctx.restore();
    }

    texture.needsUpdate = true;
  }, [canvas, texture, presetId, logo, transform.x, transform.y, transform.scale, transform.rotation]);

  return { texture, canvas };
}
