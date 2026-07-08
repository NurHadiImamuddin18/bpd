"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  PackageSearch, 
  Users, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  FileX, 
  Contact,
  FileSpreadsheet, 
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();

  const menuItemsTop = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, adminOnly: true },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
  ];

  const menuItemsPages = [
    { name: "Data Logistik", href: "/items", icon: PackageSearch, adminOnly: true },
    { name: "Barang Masuk", href: "/masuk", icon: ArrowDownToLine, adminOnly: false },
    { name: "Barang Keluar", href: "/keluar", icon: ArrowUpFromLine, adminOnly: false },
    { name: "Barang Rusak", href: "/rusak", icon: FileX, adminOnly: true },
    { name: "Data Penerima", href: "/penerima", icon: Contact, adminOnly: true },
    { name: "Laporan", href: "/laporan", icon: FileSpreadsheet, adminOnly: true },
  ];

  const visibleTop = menuItemsTop.filter(item => role === "Admin" || !item.adminOnly);
  const visiblePages = menuItemsPages.filter(item => role === "Admin" || !item.adminOnly);

  const renderMenuItem = (item: any) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar-link ${isActive ? "active" : ""}`}
      >
        <Icon size={16} />
        {item.name}
      </Link>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/pd.png" alt="BPBD" />
        <span>Badan Penanggulangan Bencana Daerah Kota Probolinggo</span>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-title">MAIN</div>
        <nav style={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
          {visibleTop.map(renderMenuItem)}
        </nav>

        <div className="sidebar-title">PAGES</div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {visiblePages.map(renderMenuItem)}
        </nav>
      </div>

      {/* User profile at bottom */}
      <div style={{ 
        padding: "12px 20px", 
        borderTop: "1px solid var(--border)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || "User")}&background=f5f5f5&color=202124&size=32`} 
            alt="User" 
            style={{ width: 32, height: 32, borderRadius: "50%" }} 
          />
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>
              {user?.nama || "Loading..."}
            </div>
            <div style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
              {role === "Admin" ? "Administrator" : "Staf Logistik"}
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            if (confirm("Apakah Anda yakin ingin keluar?")) {
              logout();
            }
          }} 
          style={{ 
            background: "transparent", 
            border: "none", 
            padding: "6px", 
            cursor: "pointer", 
            color: "var(--fg-muted)",
            display: "flex",
            alignItems: "center"
          }}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
