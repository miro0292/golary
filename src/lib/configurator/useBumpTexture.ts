"use client";

import { useMemo } from "react";
import * as THREE from "three";

const SIZE = 1024;

/**
 * Mapa de relieve con las costuras de un balón real (patrón de pentágonos),
 * igual para cualquier diseño o logo: así las costuras se ven "hundidas"
 * bajo la luz, con brillo en los bordes de cada panel, en vez de una
 * textura plana. No depende de ningún modelo .glb externo.
 */
export function useBumpTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;

    // Gris medio = altura neutra; más oscuro = hundido, más claro = elevado.
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, SIZE, SIZE);

    const r = SIZE * 0.072;
    const stepX = r * 3.1;
    const stepY = r * 2.7;

    const pentagon = (cx: number, cy: number, rad: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = cx + rad * Math.cos(a);
        const y = cy + rad * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    let row = 0;
    for (let y = -stepY; y < SIZE + stepY; y += stepY) {
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      for (let x = -stepX; x < SIZE + stepX; x += stepX) {
        // Borde claro (panel elevado) y línea oscura (costura hundida).
        ctx.strokeStyle = "#f2f2f2";
        ctx.lineWidth = SIZE * 0.009;
        pentagon(x + offset, y, r, (row % 2) * 0.6);
        ctx.stroke();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = SIZE * 0.0035;
        pentagon(x + offset, y, r, (row % 2) * 0.6);
        ctx.stroke();
      }
      row++;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
    // Se genera una sola vez: no depende de props, por eso el array vacío.
  }, []);
}
