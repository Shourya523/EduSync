import "./jcafeLayout.css";
import SideBar from "@/src/components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // <--- Crucial CSS Import

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="jcafe-layout">
      <SideBar />
      <main className="jcafe-main">
        {children}
      </main>
      {/* This container renders the popups */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}