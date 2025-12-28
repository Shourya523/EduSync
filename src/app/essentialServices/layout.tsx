import "./essential.css";
import SideBar from "@/src/components/SideBar";

export default function EssentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <SideBar />
      <main style={{ flex: 1, marginLeft: "-300px",marginTop:"20px" , padding: "0", boxSizing: "border-box" }}>
        {children}
      </main>
    </div>
  );
}