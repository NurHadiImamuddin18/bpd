"use client";

import { useAppData } from "@/context/DataProvider";
import { Package, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Users, Activity, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import WeatherWidget from "@/components/WeatherWidget";
import WeatherSearch from "@/components/WeatherSearch";

export default function Dashboard() {
  const { items, transactions, ready } = useAppData();
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === "User") {
      router.push("/masuk");
    }
  }, [role, router]);

  if (role === "User") return null;

  const Skeleton = ({ width = "60px", height = "24px" }) => (
    <div style={{ width, height, background: "var(--border)", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
  );

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const totalUnit = items.reduce((a, i) => a + i.stokTersedia, 0);
  const totalSKU = items.length;
  const totalNilai = items.reduce((a, i) => a + i.stokTersedia * i.hargaSatuan, 0);

  const masuk = transactions.filter((t) => t.tipe === "masuk");
  const keluar = transactions.filter((t) => t.tipe === "keluar");
  const totalMasuk = masuk.reduce((a, t) => a + t.jumlah, 0);
  const totalKeluar = keluar.reduce((a, t) => a + t.jumlah, 0);

  const CardHeader = ({ icon: Icon, title, value, sub, subVal, color }: any) => (
    <div className="card" style={{ position: "relative", paddingTop: "16px", paddingBottom: "16px", display: "flex", justifyContent: "space-between" }}>
      <div>
        <div style={{ color: "var(--fg-muted)", fontSize: "12px", fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-dark)", marginTop: "2px" }}>
          {ready ? value : <Skeleton width="80px" height="28px" />}
        </div>
      </div>
      <div style={{ 
        width: "48px", height: "48px", borderRadius: "12px", 
        background: color || "var(--fg-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "white"
      }}>
        <Icon size={24} />
      </div>
      <div style={{ position: "absolute", bottom: "16px", left: "20px", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
        {ready ? (
          <>
            <span style={{ color: "var(--success)", fontWeight: 700 }}>{subVal}</span> 
            <span style={{ color: "var(--fg-muted)" }}>{sub}</span>
          </>
        ) : (
          <Skeleton width="120px" height="14px" />
        )}
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Check the sales, value and bounce rate by country.</p>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "28px" }}>
        {/* Chart 1 */}
        <div className="card" style={{ padding: "16px" }}>
          <div style={{ background: "#f97316", borderRadius: "12px", height: "160px", marginBottom: "16px", padding: "16px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "40%", borderRadius: "4px" }} />
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "60%", borderRadius: "4px" }} />
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "30%", borderRadius: "4px" }} />
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "80%", borderRadius: "4px" }} />
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "50%", borderRadius: "4px" }} />
             <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", height: "90%", borderRadius: "4px" }} />
          </div>
          <h3 style={{ fontSize: "16px" }}>Barang Masuk</h3>
          <p style={{ fontSize: "13px", color: "var(--fg-muted)", marginTop: "4px" }}>Performa penerimaan barang</p>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", color: "var(--fg-muted)", fontSize: "12px" }}>
            <Clock size={12} /> diperbarui secara real-time
          </div>
        </div>

        {/* Chart 2 */}
        <div className="card" style={{ padding: "16px" }}>
          <div style={{ background: "#f97316", borderRadius: "12px", height: "160px", marginBottom: "16px", padding: "16px", position: "relative" }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
               <polyline fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" points="0,30 20,10 40,25 60,5 80,20 100,10" />
               <circle cx="0" cy="30" r="2" fill="white" />
               <circle cx="20" cy="10" r="2" fill="white" />
               <circle cx="40" cy="25" r="2" fill="white" />
               <circle cx="60" cy="5" r="2" fill="white" />
               <circle cx="80" cy="20" r="2" fill="white" />
               <circle cx="100" cy="10" r="2" fill="white" />
            </svg>
          </div>
          <h3 style={{ fontSize: "16px" }}>Barang Keluar</h3>
          <p style={{ fontSize: "13px", color: "var(--fg-muted)", marginTop: "4px" }}>Grafik distribusi barang keluar</p>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", color: "var(--fg-muted)", fontSize: "12px" }}>
            <Clock size={12} /> diperbarui secara real-time
          </div>
        </div>

        {/* Chart 3 */}
        <div className="card" style={{ padding: "16px" }}>
          <div style={{ background: "#f97316", borderRadius: "12px", height: "160px", marginBottom: "16px", padding: "16px", position: "relative" }}>
             <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
               <polyline fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" points="0,35 20,20 40,30 60,15 80,25 100,5" />
               <circle cx="0" cy="35" r="2" fill="white" />
               <circle cx="20" cy="20" r="2" fill="white" />
               <circle cx="40" cy="30" r="2" fill="white" />
               <circle cx="60" cy="15" r="2" fill="white" />
               <circle cx="80" cy="25" r="2" fill="white" />
               <circle cx="100" cy="5" r="2" fill="white" />
            </svg>
          </div>
          <h3 style={{ fontSize: "16px" }}>Barang Rusak / Tidak Layak</h3>
          <p style={{ fontSize: "13px", color: "var(--fg-muted)", marginTop: "4px" }}>Laporan aset yang dihapuskan</p>
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", color: "var(--fg-muted)", fontSize: "12px" }}>
            <Clock size={12} /> diperbarui secara real-time
          </div>
        </div>
      </div>

      {/* Top Cards (Like image) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "28px" }}>
        <CardHeader icon={Package} title="Total Stok" value={totalUnit.toLocaleString("id-ID")} sub={`dari ${totalSKU} jenis`} subVal="+5%" color="#202124" />
        <CardHeader icon={TrendingUp} title="Nilai Aset" value={formatRp(totalNilai)} sub="estimasi aset" subVal="+2%" color="#202124" />
        <CardHeader icon={ArrowDownToLine} title="Total Diterima" value={totalMasuk.toLocaleString("id-ID")} sub="transaksi masuk" subVal={`+${masuk.length}`} color="#202124" />
        <CardHeader icon={ArrowUpFromLine} title="Total Distribusi" value={totalKeluar.toLocaleString("id-ID")} sub="transaksi keluar" subVal={`+${keluar.length}`} color="#202124" />
      </div>

      {/* Weather Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", marginBottom: "28px" }}>
        <div>
          <WeatherWidget />
        </div>
        <div>
          <WeatherSearch />
        </div>
      </div>
    </div>
  );
}
