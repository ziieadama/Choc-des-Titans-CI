import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Choc des Titans — Plateforme officielle | Boxe & MMA Côte d'Ivoire",
    template: "%s | Choc des Titans",
  },
  description:
    "Plateforme officielle du Choc des Titans, la grande compétition ivoirienne de boxe et de MMA organisée par JTS Group et l'Association Ivoirienne de Boxe (AIB). Directs, résultats, combattants, galeries et billetterie.",
  keywords: [
    "Choc des Titans",
    "boxe",
    "MMA",
    "Côte d'Ivoire",
    "AIB",
    "Association Ivoirienne de Boxe",
    "Abidjan",
    "combat",
  ],
  icons: { icon: "/images/brand/logo-cdt-sm.png" },
  openGraph: {
    title: "Choc des Titans — La grande arène ivoirienne",
    description:
      "Suivez les combats en direct, découvrez les Titans et revivez chaque édition.",
    locale: "fr_CI",
    type: "website",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem("cdt-theme");if(t!=="dark"&&t!=="light"){t="light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="light"
      suppressHydrationWarning
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
