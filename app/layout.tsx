import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import MegaNav from "@/components/MegaNav";
import { getNavigationData } from "@/lib/mock-nav";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MegaNav Demo",
  description: "Demonstrating ISR with MegaNav component",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = await getNavigationData();
  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider defaultTheme="light">
          <MegaNav fallbackData={nav} />
          <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
