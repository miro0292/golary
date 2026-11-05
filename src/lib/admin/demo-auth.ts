// ⚠️ ACCESO DE PRUEBA — NO ES SEGURO.
// Solo sirve para navegar el prototipo. En la siguiente fase se reemplaza por
// Supabase Auth (usuarios reales, contraseñas cifradas y roles: admin / vendedor).

export const DEMO_ADMIN = {
  email: "admin@golary.co",
  password: "golary-demo",
  name: "Administrador Golary",
};

const KEY = "golary-admin-session";

export function demoLogin(email: string, password: string) {
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ email: DEMO_ADMIN.email, name: DEMO_ADMIN.name }));
    } catch {}
  }
  return ok;
}

export function demoSession(): { email: string; name: string } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function demoLogout() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
