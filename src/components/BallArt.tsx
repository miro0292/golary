import { useId } from "react";
import type { BallKind } from "@/lib/products";

// Ilustración temporal de balón (mientras llegan las fotos reales).
function pentagon(cx: number, cy: number, r: number, rot = -90) {
  return Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export default function BallArt({
  kind,
  colors,
  className = "",
}: {
  kind: BallKind;
  colors: [string, string];
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const [main, accent] = colors;
  const line = kind === "baloncesto" ? "#111" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`Balón de ${kind}`}>
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
        <radialGradient id={`h${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="97" rx="30" ry="2.5" fill="#000" opacity="0.12" />
      <circle cx="50" cy="50" r="46" fill={main} />
      <g clipPath={`url(#c${id})`}>
        {(kind === "futbol" || kind === "futsal" || kind === "microfutbol") && (
          <>
            <polygon points={pentagon(50, 50, 14)} fill={accent} stroke={line} strokeWidth="0.6" />
            {Array.from({ length: 5 }, (_, i) => {
              const a = ((-90 + i * 72) * Math.PI) / 180;
              const x1 = 50 + 14 * Math.cos(a), y1 = 50 + 14 * Math.sin(a);
              const x2 = 50 + 30 * Math.cos(a), y2 = 50 + 30 * Math.sin(a);
              const px = 50 + 44 * Math.cos(a + 0.63), py = 50 + 44 * Math.sin(a + 0.63);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={line} strokeWidth="0.8" />
                  <polygon points={pentagon(px, py, 12, (a * 180) / Math.PI + 36)} fill={accent} stroke={line} strokeWidth="0.6" />
                </g>
              );
            })}
            {kind === "futsal" && <rect x="0" y="47" width="100" height="6" fill={accent} opacity="0.9" />}
            {kind === "microfutbol" && <circle cx="50" cy="50" r="22" fill="none" stroke={accent} strokeWidth="2.5" />}
          </>
        )}
        {kind === "voleibol" && (
          <>
            <path d="M-5 35 Q50 20 105 45 L105 58 Q50 33 -5 48 Z" fill={accent} />
            <path d="M30 105 Q40 55 80 5 L92 12 Q52 60 44 105 Z" fill={accent} opacity="0.85" />
            <path d="M-5 70 Q45 60 70 105 L58 105 Q40 72 -5 82 Z" fill={accent} opacity="0.7" />
            <path d="M-5 35 Q50 20 105 45 M-5 48 Q50 33 105 58 M30 105 Q40 55 80 5 M-5 70 Q45 60 70 105" fill="none" stroke={line} strokeWidth="0.6" />
          </>
        )}
        {kind === "baloncesto" && (
          <g fill="none" stroke={accent} strokeWidth="2">
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <path d="M18 8 Q38 50 18 92" />
            <path d="M82 8 Q62 50 82 92" />
          </g>
        )}
      </g>
      <circle cx="50" cy="50" r="46" fill={`url(#h${id})`} />
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
    </svg>
  );
}
