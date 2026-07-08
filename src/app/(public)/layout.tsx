import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getLocale } from "@/lib/locale-server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <LocaleProvider locale={locale}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <WhatsAppFloat />
    </LocaleProvider>
  );
}
