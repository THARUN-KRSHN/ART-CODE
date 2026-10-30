import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ART//CODE 2026 - Virtual Hackathon Platform",
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
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink flex flex-col antialiased selection:bg-vermilion/20 selection:text-darkRed font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
