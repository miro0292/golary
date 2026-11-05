// Datos de PRUEBA para el panel. Se reemplazan por la base de datos real en la siguiente fase.
import { products } from "@/lib/products";
import { CHANNELS, PAYMENTS, type AdminData, type AdminProduct, type Movement, type Sale } from "./types";

// Generador pseudoaleatorio con semilla para que los datos de prueba sean siempre iguales.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function buildSeed(): AdminData {
  const rand = rng(2026);

  const adminProducts: AdminProduct[] = products.map((p, i) => {
    const per = Math.max(2, Math.round(p.stock / p.sizes.length));
    return {
      id: p.id,
      sku: `GOL-${p.category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
      slug: p.slug,
      name: p.name,
      category: p.category,
      kind: p.kind,
      price: p.price,
      oldPrice: p.oldPrice,
      cost: Math.round((p.price * 0.42) / 100) * 100,
      colors: p.colors,
      sizes: p.sizes,
      stock: Object.fromEntries(p.sizes.map((s, j) => [s, Math.max(0, per - j * 3 - (i % 4 === 0 ? per - 3 : 0))])),
      minStock: 5,
      active: true,
      badge: p.badge,
      description: p.description,
    };
  });

  const sales: Sale[] = [];
  const movements: Movement[] = [];
  const now = new Date();
  let number = 1000;

  for (let day = 29; day >= 0; day--) {
    const perDay = Math.floor(rand() * 4) + (day < 7 ? 2 : 1);
    for (let k = 0; k < perDay; k++) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      date.setHours(9 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
      if (date > now) date.setTime(now.getTime() - 60_000 * (k + 1));

      const channel = CHANNELS[Math.floor(rand() * (rand() < 0.15 ? 4 : 3))];
      const lines = channel === "Por mayor" ? 1 : 1 + Math.floor(rand() * 2);
      const items = Array.from({ length: lines }, () => {
        const p = adminProducts[Math.floor(rand() * adminProducts.length)];
        const size = p.sizes[Math.floor(rand() * p.sizes.length)];
        const qty = channel === "Por mayor" ? 12 + Math.floor(rand() * 12) : 1 + Math.floor(rand() * 2);
        const price = channel === "Por mayor" ? Math.round((p.price * 0.8) / 100) * 100 : p.price;
        return { productId: p.id, name: p.name, size, qty, price };
      });
      const total = items.reduce((n, it) => n + it.qty * it.price, 0);
      const id = `s${number}`;
      sales.push({
        id,
        number: number++,
        date: date.toISOString(),
        channel,
        payment: PAYMENTS[Math.floor(rand() * PAYMENTS.length)],
        customer: channel === "Por mayor" ? "Club Deportivo (prueba)" : undefined,
        items,
        discount: 0,
        total,
        status: "pagada",
      });
      items.forEach((it, j) =>
        movements.push({ id: `${id}-${j}`, date: date.toISOString(), productId: it.productId, size: it.size, qty: -it.qty, type: "venta", note: `Venta #${number - 1}` }),
      );
    }
  }

  return { products: adminProducts, movements: movements.reverse(), sales: sales.reverse() };
}
