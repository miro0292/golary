# Golary · Tienda Deportiva

Tienda en línea y panel de administración de **Golary**, fabricantes colombianos de balones.

## Qué incluye

- **Tienda**: inicio, catálogo por deporte, ofertas, búsqueda, ficha de producto, carrito y pedido por WhatsApp.
- **Panel de administración** (`/admin`): resumen de ventas, productos, inventario por talla y registro manual de ventas.

> Estado: **prototipo**. Los productos son de prueba y el panel guarda los datos solo en el navegador.
> La siguiente fase conecta Supabase (ver `supabase/schema.sql`).

## Trabajar en local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000 (tienda) y http://localhost:3000/admin (panel).

## Publicación

Cada `git push` a `main` publica el sitio en GitHub Pages automáticamente
(`.github/workflows/deploy-pages.yml`): https://miro0292.github.io/golary/

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/app/(tienda)` | Páginas públicas de la tienda |
| `src/app/admin` | Panel de administración |
| `src/components` | Componentes visuales |
| `src/lib/products.ts` | Catálogo de prueba |
| `src/lib/config.ts` | WhatsApp, correo y envío gratis |
| `supabase/schema.sql` | Base de datos para la siguiente fase |
