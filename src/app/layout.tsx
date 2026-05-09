import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Creative developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0a] text-white antialiased">
        {/* Initial load curtain — sweeps up to reveal the page */}
        <PageTransition />
        {/* Keyboard users: skip repetitive nav ───────────────────────── */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll>
          <header>
            <Navbar />
          </header>
          <main id="main-content">{children}</main>
          <footer className="py-8 border-t border-white/10 text-center text-sm text-white/40">
            <div className="container">
              © 2026 &middot; Built with Next.js &amp; GSAP
            </div>
          </footer>
        </SmoothScroll>
      </body>
    </html>
  );
}