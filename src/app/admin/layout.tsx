import type { Metadata } from "next";
import { AdminStoreProvider } from "@/context/AdminStore";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Panel de administración", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminStoreProvider>
      <AdminShell>{children}</AdminShell>
    </AdminStoreProvider>
  );
}
