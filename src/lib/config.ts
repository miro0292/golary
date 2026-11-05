// Datos generales de la tienda.
// Dirección, teléfonos y correos: tomados de golary.co (reales).
export const STORE = {
  name: "Golary",
  tagline: "Tienda deportiva · Fabricantes de balones",
  // TODO: confirmar cuál de los teléfonos de abajo atiende pedidos por WhatsApp
  // y ponerlo aquí en formato 57XXXXXXXXXX (hoy es un número de prueba).
  whatsapp: "573000000000",
  email: "gerenciacomercial@golary.co",
  address: "Calle 20 Sur #29C-75, barrio Santander, Bogotá D.C.",
  phones: ["(601) 772 0159", "(601) 700 6360", "(+57) 321 453 8707", "(+57) 311 443 4180"],
  freeShippingFrom: 200000,
};

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
