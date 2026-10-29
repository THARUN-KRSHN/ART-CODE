import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serifFont = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ART//CODE 2026 — Virtual Hackathon Platform",
  description:
    "Where Creativity Meets Technology. A virtual hackathon platform by DELTA, Data Science Department Association, Christ College of Engineering (Autonomous), Irinjalakuda.",
  keywords: [
    "hackathon",
    "art",
    "culture",
    "heritage",
    "creative technology",
    "DELTA",
    "Christ College of Engineering",
    "data science",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body className="min-h-screen bg-ivory text-ink flex flex-col antialiased selection:bg-terracotta/20 selection:text-terracotta-700">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

