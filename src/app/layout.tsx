import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Import your new component
import SnowfallBackground from "./SnowfallBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EduSync",
  description: "Unified AI-powered campus ecosystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {/* 2. Add the component here, before children */}
        <SnowfallBackground />
        
        {children}
      </body>
    </html>
  );
}