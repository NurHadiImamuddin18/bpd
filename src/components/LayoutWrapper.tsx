"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { role, isReady } = useAuth();

  if (!isReady) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Memuat sesi...</div>;
  }

  if (!role) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
