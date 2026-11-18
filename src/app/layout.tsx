import type { Metadata } from "next";
import { Titillium_Web, Inter } from "next/font/google";
import "./globals.css";

const titilliumWeb = Titillium_Web({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-titillium-web",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Twelve Skies · 3D Celestial Photo Vault",
  description: "An immersive 3D space gallery mapping personal memories across the 12 zodiac constellations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${titilliumWeb.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-space-black text-white antialiased selection:bg-cyan-glow selection:text-space-navy">
        {children}
      </body>
    </html>
  );
}
