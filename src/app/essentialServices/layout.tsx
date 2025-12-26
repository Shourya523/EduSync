import "./essentialLayout.css";
import SideBar from "@/src/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="essential-layout">
      <SideBar />
      <main className="essential-main">
        {children}
      </main>
    </div>
  );
}
