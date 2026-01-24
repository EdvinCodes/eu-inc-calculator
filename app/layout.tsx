import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EU Inc. Equity Calculator | Stock Options Simulator",
  description:
    "Calculate the real value of your ESOP and Stock Options under the new EU Inc standard. Tax estimation and net profit simulation.",
  openGraph: {
    title: "EU Inc. Equity Calculator",
    description: "How much is your equity really worth? Calculate it now.",
    url: "https://tu-dominio.vercel.app", // Lo cambiaremos luego
    siteName: "EU Inc. Calculator",
    images: [
      {
        url: "/og-image.jpg", // La imagen que pusiste en public
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EU Inc. Equity Calculator",
    description: "Visualize your startup equity value securely.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Cambiamos el idioma a inglés
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
