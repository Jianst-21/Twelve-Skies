import type { Metadata } from "next";
import { Titillium_Web, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const titilliumWeb = Titillium_Web({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-titillium-web",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Twelve Skies · 3D Celestial Photo Vault",
  description:
    "A private 3D zodiac observatory mapping personal photographs into twelve constellations by calendar date.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${titilliumWeb.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-space-black text-ink-primary antialiased selection:bg-cyan-glow selection:text-space-navy">
        {children}
      </body>
    </html>
  );
}
