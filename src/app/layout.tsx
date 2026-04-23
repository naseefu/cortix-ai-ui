import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cortix AI | Enterprise Intelligence",
  description: "Advanced Document Chat platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Defaulting to "dark" class on html for forced sleek dark mode
    <html lang="en" className="dark">
      <body className={cn(inter.className, "h-screen w-screen overflow-hidden bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}
