import type { BallKind, Product } from "@/lib/products";

export type AdminProduct = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  kind: BallKind;
  price: number;
  oldPrice?: number;
  cost: number; // costo de fabricación por unidad
  colors: [string, string];
  sizes: string[];
  stock: Record<string, number>; // stock por talla
  minStock: number; // alerta de stock bajo (por talla)
  active: boolean;
  badge?: Product["badge"];
  description: string;
};

export type MovementType = "entrada" | "salida" | "ajuste" | "venta" | "anulacion";

export type Movement = {
  id: string;
  date: string; // ISO
  productId: string;
  size: string;
  qty: number; // positivo suma, negativo resta
  type: MovementType;
  note?: string;
};

export const CHANNELS = ["Local", "WhatsApp", "Web", "Por mayor"] as const;
export const PAYMENTS = ["Efectivo", "Transferencia", "Nequi", "Daviplata", "Tarjeta"] as const;
export type Channel = (typeof CHANNELS)[number];
export type Payment = (typeof PAYMENTS)[number];

export type SaleItem = { productId: string; name: string; size: string; qty: number; price: number };

export type Sale = {
  id: string;
  number: number;
  date: string; // ISO
  channel: Channel;
  payment: Payment;
  customer?: string;
  items: SaleItem[];
  discount: number;
  total: number;
  status: "pagada" | "anulada";
};

export type AdminData = {
  products: AdminProduct[];
  movements: Movement[];
  sales: Sale[];
};

export const totalStock = (p: AdminProduct) => Object.values(p.stock).reduce((a, b) => a + b, 0);
export const lowSizes = (p: AdminProduct) => p.sizes.filter((s) => (p.stock[s] ?? 0) <= p.minStock);
