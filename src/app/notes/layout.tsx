import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./dashboardLayout.css";
import SideBar from "@/src/components/SideBar";

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
        <div className="dashboard-layout">
          <SideBar />
          <main className="dashboard-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
