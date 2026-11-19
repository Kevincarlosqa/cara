import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], display: "swap" });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const brand = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500"], display: "swap" });

const isDemo = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;

export const metadata: Metadata = {
  ...(isDemo ? { robots: { index: false, follow: false } } : {}),
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: "Cara Sanctuary — Headspa, faciales y corporales en Lima", template: "%s · Cara Sanctuary" },
  description: "Un santuario de salud y belleza en Lima. Headspa, faciales y tratamientos corporales para cuidar tu cuero cabelludo, tu piel y tu calma. Reserva online o por WhatsApp.",
  openGraph: { title: "Cara Sanctuary", description: "Headspa, faciales y corporales. Reserva tu cita.", locale: "es_PE", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f6f1ea" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${display.variable} ${sans.variable} ${brand.variable} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
