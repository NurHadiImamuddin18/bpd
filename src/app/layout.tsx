import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { DataProvider } from "@/context/DataProvider";
import { AuthProvider } from "@/context/AuthContext";
export const metadata: Metadata = {
  title: "BPBD Logistik — Sistem Manajemen Gudang",
  description: "Aplikasi manajemen logistik dan inventaris Badan Penanggulangan Bencana Daerah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <DataProvider>
            <div className="app-layout">
              <Sidebar />
              <div className="main-wrapper">
                <Header />
                <main className="main-content">
                  {children}
                </main>
              </div>
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
