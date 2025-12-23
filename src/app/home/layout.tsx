import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./homeLayout.css";
import TopBar from "@/src/components/TopBar";

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
        <TopBar />
        
        {children}
      </body>
    </html>
  );
}
