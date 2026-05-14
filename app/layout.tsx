import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/lib/i18n";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ORI 369 - Fizioterapija in Wellness Terapije | Maribor, Celje, Murska Sobota, Graz",
  description: "Vrhunska fizioterapija in wellness terapije v Mariboru. Pokrivamo Celje, Murska Soboto in regijo do Graza. Tecar terapija, elektrostimulacija, MotioScan 3D analiza in več.",
  keywords: "fizioterapija Maribor, wellness Celje, terapije Murska Sobota, zdravljenje Graz, Tecar terapija, elektrostimulacija, MotioScan 3D, manualna terapija, magnetna terapija, laserska terapija, rehabilitacija, regeneracija, ORI 369, Slovenija, Avstrija",
  openGraph: {
    title: "ORI 369 - Fizioterapija in Wellness Terapije | Maribor, Celje, Murska Sobota, Graz",
    description: "Vrhunska fizioterapija in wellness terapije v Mariboru. Pokrivamo Celje, Murska Soboto in regijo do Graza.",
    type: "website",
    locale: "sl_SI",
    siteName: "ORI 369",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <head>
        <LocalBusinessSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LanguageProvider>
          <CartProvider>
            <Toaster position="top-right" />
            <Header />
            <CartDrawer />
            <main className="pt-28 md:pt-36">{children}</main>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
