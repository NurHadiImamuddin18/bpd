"use client";

import { usePathname } from "next/navigation";
import { Search, Settings, User, Menu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  
  const getPageName = () => {
    if (pathname === "/") return "Analytics";
    if (pathname === "/users") return "Users";
    const path = pathname.replace("/", "");
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const pageName = getPageName();

  return (
    <header className="top-header" style={{ padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", flexShrink: 0, marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="ghost" style={{ padding: "4px", color: "var(--fg-muted)", display: "flex", alignItems: "center" }}>
          <Menu size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
          <span style={{ color: "var(--fg-muted)" }}>Pages</span>
          <span style={{ color: "var(--fg-muted)" }}>/</span>
          <span style={{ fontWeight: 600, color: "var(--fg-dark)" }}>{pageName}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative", width: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)" }} />
          <input type="text" placeholder="Search here" style={{ paddingLeft: "30px", height: "36px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px" }} />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
          <button className="ghost" style={{ padding: "6px", borderRadius: "8px", color: "var(--fg-muted)" }}>
            <User size={16} />
          </button>
          <button className="ghost" style={{ padding: "6px", borderRadius: "8px", color: "var(--fg-muted)" }}>
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
