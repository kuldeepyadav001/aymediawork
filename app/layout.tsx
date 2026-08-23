import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "lenis/dist/lenis.css";
import "./globals.css";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "AY Media Work",
    template: "%s | AY Media Work",
  },
  description:
    "AY Media Work creates premium visual content and digital experiences for brands, businesses, and creators.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08090d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${manrope.variable} ${spaceGrotesk.variable} dark`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
