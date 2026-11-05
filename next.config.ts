import type { NextConfig } from "next";
import path from "node:path";

// En GitHub Pages el sitio vive en /golary (miro0292.github.io/golary).
// En local y en un dominio propio (golary.co) BASE_PATH queda vacío.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // genera un sitio estático (HTML/CSS/JS) en la carpeta "out"
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
