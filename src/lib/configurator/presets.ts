// Diseños base del configurador 3D. Cada preset dibuja la textura del balón
// sobre un canvas 2D (equirectangular, se envuelve sobre la esfera). No
// dependen de imágenes externas: se generan por código, así que no hay
// nada que cargar ni licencias que revisar.

export type PresetId = "clasico" | "rayas" | "paneles" | "neon" | "cuero";

export type Preset = {
  id: PresetId;
  name: string;
  swatch: string; // color de muestra para la galería
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
};

function pentagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot = 0) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function fillBase(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
}

// ---------------------------------------------------------------------------
const clasico: Preset["draw"] = (ctx, size) => {
  fillBase(ctx, size, "#f5f5f5");
  const r = size * 0.072;
  const stepX = r * 3.1;
  const stepY = r * 2.7;
  ctx.fillStyle = "#15171c";
  ctx.strokeStyle = "#15171c";
  ctx.lineWidth = size * 0.004;
  let row = 0;
  for (let y = -stepY; y < size + stepY; y += stepY) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let x = -stepX; x < size + stepX; x += stepX) {
      pentagon(ctx, x + offset, y, r, (row % 2) * 0.6);
      ctx.fill();
    }
    row++;
  }
};

// ---------------------------------------------------------------------------
const rayas: Preset["draw"] = (ctx, size) => {
  fillBase(ctx, size, "#ffffff");
  const bands = 16;
  const w = size / bands;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#00a8e8" : "#ffffff";
    ctx.fillRect(i * w, 0, w, size);
  }
  // costuras horizontales sutiles
  ctx.strokeStyle = "rgba(11,11,12,0.25)";
  ctx.lineWidth = size * 0.003;
  for (let y = size * 0.12; y < size; y += size * 0.16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
};

// ---------------------------------------------------------------------------
const paneles: Preset["draw"] = (ctx, size) => {
  fillBase(ctx, size, "#0b0b0c");
  const cols = 10;
  const rowsN = 10;
  const w = size / cols;
  const h = size / rowsN;
  const palette = ["#00a8e8", "#0086bb", "#111827", "#1c1d20"];
  for (let r = 0; r < rowsN; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * w;
      const cy = r * h;
      ctx.fillStyle = palette[(r + c) % palette.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + w, cy);
      ctx.lineTo(cx, cy + h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = palette[(r + c + 2) % palette.length];
      ctx.beginPath();
      ctx.moveTo(cx + w, cy);
      ctx.lineTo(cx + w, cy + h);
      ctx.lineTo(cx, cy + h);
      ctx.closePath();
      ctx.fill();
    }
  }
};

// ---------------------------------------------------------------------------
const neon: Preset["draw"] = (ctx, size) => {
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, "#0a0b18");
  g.addColorStop(1, "#15173a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const lines = 14;
  const colors = ["#00f0ff", "#ff2bd6"];
  ctx.lineWidth = size * 0.004;
  for (let i = 0; i <= lines; i++) {
    const x = (i / lines) * size;
    ctx.strokeStyle = colors[i % 2];
    ctx.shadowColor = colors[i % 2];
    ctx.shadowBlur = size * 0.012;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let i = 0; i <= lines / 1.5; i++) {
    const y = (i / (lines / 1.5)) * size;
    ctx.strokeStyle = colors[(i + 1) % 2];
    ctx.shadowColor = colors[(i + 1) % 2];
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
};

// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cuero: Preset["draw"] = (ctx, size) => {
  const g = ctx.createRadialGradient(size * 0.4, size * 0.35, size * 0.1, size * 0.5, size * 0.5, size * 0.75);
  g.addColorStop(0, "#9c6b3e");
  g.addColorStop(1, "#6b4423");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // grano de cuero (ruido determinista, siempre igual)
  const rand = mulberry32(7);
  for (let i = 0; i < 9000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = rand() * size * 0.0025 + size * 0.0007;
    ctx.fillStyle = `rgba(0,0,0,${0.05 + rand() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // costuras tipo panel clásico
  const rPent = size * 0.08;
  const stepX = rPent * 3.1;
  const stepY = rPent * 2.7;
  ctx.strokeStyle = "rgba(40,20,5,0.55)";
  ctx.lineWidth = size * 0.0035;
  let row = 0;
  for (let y = -stepY; y < size + stepY; y += stepY) {
    const offset = row % 2 === 0 ? 0 : stepX / 2;
    for (let x = -stepX; x < size + stepX; x += stepX) {
      pentagon(ctx, x + offset, y, rPent, (row % 2) * 0.6);
      ctx.stroke();
    }
    row++;
  }
};

export const presets: Preset[] = [
  { id: "clasico", name: "Clásico Blanco/Negro", swatch: "#f5f5f5", draw: clasico },
  { id: "rayas", name: "Rayas Verticales", swatch: "#00a8e8", draw: rayas },
  { id: "paneles", name: "Paneles Geométricos", swatch: "#0086bb", draw: paneles },
  { id: "neon", name: "Neón Futurista", swatch: "#0a0b18", draw: neon },
  { id: "cuero", name: "Textura Cuero", swatch: "#8a5a34", draw: cuero },
];

export const getPreset = (id: PresetId) => presets.find((p) => p.id === id) ?? presets[0];
