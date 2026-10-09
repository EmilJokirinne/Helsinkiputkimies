import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: { default: "Putkimies Helsingissä – hinnat, palvelut ja vertailu", template: `%s | ${SITE_NAME}` },
  description:
    "Riippumaton putkitöiden hinta- ja vertailupalvelu Helsingissä. Vertaile putkiliikkeiden julkaisemia hintoja ja laadi tarjouspyyntö.",
  formatDetection: { telephone: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0F2A44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={archivo.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <Header />
        <main id="sisalto" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
