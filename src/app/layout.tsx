import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vibino — The brain of your company",
    template: "%s · Vibino",
  },
  description:
    "Vibino indexes every codebase, meeting, and conversation your team produces — then answers questions like the smartest person in the room.",
};

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-canvas text-fg antialiased">{children}</body>
    </html>
  );
}
