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
  LogOut,
  User,
  X
} from "lucide-react";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen?: boolean, setIsSidebarOpen?: (val: boolean) => void }) {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();

  const menuItemsTop = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: true },
    { name: "Users", href: "/users", icon: Users, adminOnly: true },
  ];

  const menuItemsPages = [
    { name: "Data Barang", href: "/items", icon: PackageSearch, adminOnly: true },
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
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
        />
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/pd.png" alt="BPBD" />
            <span>Badan Penanggulangan Bencana Daerah Kota Probolinggo</span>
          </div>
          {setIsSidebarOpen && (
            <button 
              className="mobile-close-btn"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          )}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", color: "var(--fg-muted)" }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "120px" }}>
              {user?.nama || "Loading..."}
            </div>
            <div style={{ fontSize: "11px", color: "var(--fg-muted)" }}>
              {user?.username || "..."}
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
    </>
  );
}
