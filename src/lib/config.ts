// Datos generales de la tienda. Cambia aquí el número de WhatsApp real.
export const STORE = {
  name: "Golary",
  tagline: "Tienda deportiva · Fabricantes de balones",
  whatsapp: "573000000000", // TODO: reemplazar por el número real (formato 57XXXXXXXXXX)
  email: "ventas@golary.co",
  freeShippingFrom: 200000,
};

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
