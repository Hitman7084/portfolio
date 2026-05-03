import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

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
        <SmoothScroll>
          <header>
            <Navbar />
          </header>
          <main>{children}</main>
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