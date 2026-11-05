# Golary · Contexto del proyecto

> Claude lee este archivo automáticamente al abrir esta carpeta (VS Code, terminal o app de escritorio).
> Mantenlo al día cuando cambien decisiones importantes.

## El negocio

- **Golary®** es una marca colombiana que **fabrica balones** y artículos deportivos. Tiene fábrica propia y pronto abrirá su **primer local físico**.
- El dueño se comunica en **español**: responde siempre en español, explicando claramente y sin tecnicismos innecesarios. No es programador.
- Sitio actual (viejo, en WordPress): https://golary.co — se reemplazará por este proyecto.
- Inspiración de diseño: **Decathlon Colombia** (decathlon.com.co) para la estructura general de la tienda, y el **propio golary.co** (su sitio actual) para el hero/panel principal — fondo cósmico oscuro, balón con resplandor, lista de características con hexágonos. Nunca se copia marca/logo ajenos.
- Categorías: Fútbol, Futsal, Voleibol, Baloncesto, Microfútbol, Importados ("Importados" son de **otras marcas**: nunca llevan fotos ni el logo Golary).
- Canales de venta: Local, WhatsApp, Web, Por mayor (clubes, escuelas, colegios — balones personalizados con escudo).
- Medios de pago en Colombia: Efectivo, Transferencia, Nequi, Daviplata, Tarjeta. Moneda **COP sin decimales** (`formatCOP` en `src/lib/config.ts`).
- **Contacto real** (tomado de golary.co, en `STORE` de `src/lib/config.ts`): dirección de fábrica/oficina en Bogotá, teléfonos, correo `gerenciacomercial@golary.co`. El **WhatsApp sigue siendo un número de prueba** (`STORE.whatsapp`): falta que el dueño confirme cuál de los teléfonos reales atiende pedidos.
- Redes sociales reales (en la barra superior del header): X `@balones_golary`, Facebook `balonesgolary`, Instagram `@balonesgolary`, YouTube (solo se tiene el link genérico `youtube.com`, falta el canal exacto).
- **Fotos de producto** — tres niveles, todo en `src/assets/products/` e importado en `src/lib/products.ts`:
  1. **Reales** (`photoReal: true`): fotos de fábrica que cargó el dueño (`GOLARY-PRO-2.jpg`, `GOLARY-VOLLEIBALL-2.jpg`, `5ROCKYRJ2.jpg`, `pmxams3.jpg`, `ch1.jpg`, `chm2-1.jpg`; `images.jpg` quedó sin usar, es otra variante de "Rookie"). Los productos que las usan (Pro Max, Challenge, Profesional, Rookie, Soft Touch 3.0) ya tienen **nombre y precio alineados al catálogo real de golary.co** — no muestran el aviso de "foto de ejemplo".
  2. **De ejemplo** (sin `photoReal`, posible IA/stock): `ejemplo-*.jpg`, repartidas por rotación (`examplePhotos` en `products.ts`) entre el resto de productos de Fútbol/Futsal/Voleibol/Baloncesto/Microfútbol. Si existe `image`, `ProductCard`/ficha de producto la muestran con el aviso "Foto de ejemplo, aún no es el producto final".
  3. **Sin foto**: se dibuja con `BallArt` (SVG). Es el caso de "Importados" (a propósito) y cualquier producto nuevo sin imagen.
  - Para subir una foto real nueva: colocarla en `src/assets/products/`, importarla en `products.ts`, asignarla a `image` del producto y poner `photoReal: true`.

## Identidad visual

- Logo: `src/assets/logo-golary.png` (letras blancas sobre fondo negro, "TIENDA DEPORTIVA" en azul). Se importa de forma estática (`import logo from "@/assets/logo-golary.png"`) para que funcione con el `basePath` de GitHub Pages — **no** usar rutas tipo `/brand/...` en `<Image>`.
- Colores (tokens en `src/app/globals.css`, Tailwind v4 `@theme`):
  - `brand` #00a8e8 (azul Golary), `brand-dark` #0086bb, `brand-light` #e6f6fd
  - `ink` #0b0b0c (negro), `sale` #e4002b (ofertas)
- Tipografía: **Barlow** (texto, `font-sans`) y **Barlow Condensed** (títulos en mayúscula, `font-display`).
- Estilo: encabezado negro, botones redondeados (`rounded-full`), títulos condensados en mayúscula.

## Stack técnico

- **Next.js 15.5.x** (App Router, TypeScript) + **React 19.1** + **Tailwind CSS v4** + `lucide-react` (íconos).
- `next.config.ts` usa `output: "export"` → **sitio 100 % estático** (carpeta `out/`). Consecuencias:
  - Nada de API routes, server actions, middleware ni `searchParams` en server components.
  - Rutas dinámicas solo con `generateStaticParams` (ej. `/producto/[slug]`, `/categoria/[slug]`).
  - Páginas que dependen de la URL usan `useSearchParams` dentro de `<Suspense>` (ej. `/buscar`, `/admin/productos/editar?id=`).
  - Formularios y enlaces internos con `next/link` o `router.push` (no `<form action="/...">`, ignora el basePath).
- `BASE_PATH` (variable de entorno) = `/golary` solo al publicar en GitHub Pages; vacío en local.
- `NEXT_PUBLIC_NOINDEX=1` en Pages para que Google no indexe la versión temporal.
- En Windows (Git Bash) usar `MSYS_NO_PATHCONV=1` al pasar `BASE_PATH=/golary`.

## Comandos

```bash
npm install          # primera vez (node_modules no se sube a OneDrive ni a git)
npm run dev          # http://localhost:3000  (tienda)  y  /admin  (panel)
npm run build        # genera el sitio estático en out/
```

## Publicación

- Repositorio: https://github.com/miro0292/golary (público), rama `main`.
- Cada `git push` a `main` ejecuta `.github/workflows/deploy-pages.yml` y publica en **https://miro0292.github.io/golary/**
- GitHub Pages está configurado con fuente "GitHub Actions". **No agregar otro workflow de Pages** (ya pasó con `nextjs.yml` y competían).
- Carpeta local: `C:\Users\miro0\OneDrive\Documentos\GOLARY` (en OneDrive: no subir `node_modules`, `.next`, `out`).

## Estructura

| Ruta | Contenido |
|---|---|
| `src/app/layout.tsx` | Layout raíz (fuentes, metadatos SEO) |
| `src/app/(tienda)/` | Tienda pública con Header/Footer/carrito: inicio, `categoria/[slug]`, `producto/[slug]`, `ofertas`, `buscar`, `carrito`, `login` (maqueta), `tienda`, `por-mayor` |
| `src/app/admin/` | Panel: `login`, resumen (`page.tsx`), `productos` (+ `nuevo`, `editar?id=`), `inventario`, `ventas` (+ `nueva` = punto de venta) |
| `src/components/` | `Header`, `Footer`, `CartDrawer`, `ProductCard`, `ProductGrid`, `ProductRail`, `HeroCarousel`, `BallArt`, `AddToCart`, `PageHero` |
| `src/components/admin/` | `AdminShell` (menú lateral + protección), `ProductForm`, `SalesChart`, `ui.tsx` (Card, botones, inputs) |
| `src/context/CartContext.tsx` | Carrito (localStorage `golary-cart-v1`) |
| `src/context/AdminStore.tsx` | Datos del panel: productos, movimientos, ventas (localStorage `golary-admin-data-v1`) |
| `src/lib/products.ts` | Catálogo de PRUEBA de la tienda (22 productos) |
| `src/lib/admin/` | `types.ts` (modelo), `seed.ts` (datos de prueba), `demo-auth.ts` (acceso de prueba) |
| `src/lib/config.ts` | WhatsApp, correo, envío gratis desde $200.000, `formatCOP` |
| `supabase/schema.sql` | Esquema de base de datos para la siguiente fase |
| `src/app/(tienda)/personalizar/` | **Configurador 3D** ("Personaliza tu balón", enlazado en el header con badge "Nuevo") |
| `src/components/configurator/` | `BallConfigurator` (estado + subir logo + guardar/WhatsApp), `BallScene` (Canvas R3F, luces, sombras, `OrbitControls`), `BallMesh` (esfera procedural con la textura), `BallMeshGLTF` (alternativa para un modelo .glb real, ver comentario del archivo), `ControlPanel` (UI) |
| `src/lib/configurator/` | `presets.ts` (5 diseños base dibujados con Canvas 2D: Clásico, Rayas, Paneles, Neón, Cuero), `useBallTexture.ts` (compone diseño base + logo en un canvas → `THREE.CanvasTexture`) |

## Estado actual (prototipo)

Hecho:
- Tienda completa con carrito; el pago en línea está deshabilitado y se ofrece **"Pedir por WhatsApp"** con el pedido armado.
- Panel admin: resumen (KPIs, ventas 14 días, por canal, stock bajo, más vendidos), productos (CRUD, costo y margen), inventario **por talla** (entrada / salida / ajuste por conteo + historial), registro manual de ventas tipo punto de venta (descuenta stock, anula y devuelve stock, exporta CSV).
- **Tema claro/oscuro**: botón en el header de la tienda y en la barra del panel admin (`ThemeToggle.tsx` + `context/ThemeContext.tsx`). Usa `<html data-theme="dark">` + la variante `@custom-variant dark` en `globals.css`, con un script inline en `layout.tsx` que evita el parpadeo al cargar. Se eligió oscuro = tonos de "ink"/"ink-soft", el azul de marca no cambia. Cobertura completa: toda la tienda pública y el panel admin (títulos, tarjetas, tablas e inputs llevan el color de texto explícito — no basta con heredarlo del `body`, hay que ponerlo en cada pieza).
- **Configurador 3D "Personaliza tu balón"** (`/personalizar`): balón esférico procedural (no depende de ningún archivo .glb) con Three.js + React Three Fiber v9 + drei v10 (**ojo:** v8/v9 de R3F — React 19 necesita v9, v8 rompe el build por los tipos de JSX). La textura (diseño base + logo del usuario) se compone en un `<canvas>` 2D normal y se sube como `THREE.CanvasTexture`; cambiar el diseño base nunca mueve el logo porque ambos se redibujan juntos a partir del mismo estado. "Guardar diseño" hace `canvas.toDataURL()` sobre el `<canvas>` de WebGL (por eso el `Canvas` de R3F lleva `preserveDrawingBuffer: true`) y descarga un PNG; como no hay checkout para productos personalizados, "Añadir al carrito" en realidad abre WhatsApp con un resumen del diseño. Si más adelante quieren un modelo 3D real de balón (.glb), `BallMeshGLTF.tsx` ya está listo para recibirlo (ver el comentario del archivo).

Limitaciones conocidas (todas a resolver en la Fase de base de datos):
- El panel guarda datos **solo en el navegador** (localStorage) y arranca con datos de prueba.
- El acceso al panel es **de prueba e inseguro** (`demo-auth.ts`), no es autenticación real.
- Los cambios del panel **no** se reflejan en la tienda pública (la tienda lee `src/lib/products.ts`).
- El número de WhatsApp es un marcador (`STORE.whatsapp` en `config.ts`): pedir el real al dueño.
- Falta dirección y horario del local (página `/tienda`).

## Próximos pasos (hoja de ruta)

1. **Supabase**: crear proyecto, ejecutar `supabase/schema.sql`, Auth real con roles (`admin`, `vendedor`, `cliente`), Storage para fotos (bucket `productos`). Reemplazar `AdminStore` (localStorage) por llamadas a Supabase manteniendo la misma interfaz; registrar ventas con la función SQL `register_sale` (atómica).
2. Que la tienda lea el catálogo desde Supabase (con export estático: lectura en el cliente o reconstrucción al publicar; o pasar a hosting con servidor como Vercel).
3. Hosting definitivo + dominio **golary.co** (hoy en WordPress) y correo corporativo (Google Workspace).
4. Pagos en línea en Colombia: **Wompi** (Bancolombia) o Mercado Pago.
5. Facturación electrónica DIAN (Alegra o Siigo).
6. SEO local: Perfil de Empresa de Google cuando abra el local; Search Console.

## Notas de mantenimiento

- Seguridad: se actualizó a Next 15.5.29 (corrige CVE-2025-66478). Queda un aviso de `postcss` interno de Next que solo se corrige con Next 16 (cambio mayor, hacerlo con pruebas).
- Antes de publicar algo, compilar con `npm run build` y revisar en el navegador.
- Commits en español, describiendo el cambio para el negocio.
