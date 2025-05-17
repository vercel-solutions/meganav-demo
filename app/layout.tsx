import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import MegaNav from "@/components/MegaNav";
import { getNavigationData } from "@/lib/navigation-store";
import { ThemeProvider } from "@/components/theme-provider";
import { VercelLogo } from "@/components/VercelLogo";

// Optimize font loading
const geist = Geist({
  subsets: ["latin"],
  display: "swap", // Add font-display swap
  preload: true,
});

export const metadata: Metadata = {
  title: "MegaNav Demo",
  description: "Demonstrating ISR with MegaNav component",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get navigation data from our store
  const nav = getNavigationData();

  return (
    <html
      lang="en"
      className={`scroll-smooth ${geist.className}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="light">
          <MegaNav fallbackData={nav} />
          <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
            {children}
          </main>
          <footer className="py-10 w-full mt-auto border-t flex items-center justify-center bg-accents-1 dark:bg-gray-900 z-20">
            <span className="text-primary dark:text-gray-400">Created by</span>
            <a
              href="https://vercel.com"
              aria-label="Vercel.com Link"
              target="_blank"
              rel="noreferrer"
              className="text-black dark:text-white"
            >
              <VercelLogo />
            </a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
