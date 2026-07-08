"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { role, isReady } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Jika di landing page, abaikan pengecekan sesi dan layout dashboard
  if (pathname === "/") {
    return <>{children}</>;
  }

  if (!isReady) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Memuat sesi...</div>;
  }

  if (!role) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="main-wrapper">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
