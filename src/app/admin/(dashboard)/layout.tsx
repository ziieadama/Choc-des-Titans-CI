import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Back Office | Choc des Titans",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
