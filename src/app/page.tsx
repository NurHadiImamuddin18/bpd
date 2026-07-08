import Link from "next/link";
import { ArrowRight, Box, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Badan Penanggulangan Bencana Daerah Kota Probolinggo",
};

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "var(--font)", color: "var(--fg-dark)", overflowX: "hidden" }}>
      <style>{`
        .landing-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f97316;
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .landing-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(249, 115, 22, 0.4);
        }
        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)",
        position: "relative"
      }}>
        {/* Abstract Background Shapes */}
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "400px", height: "400px", background: "rgba(249, 115, 22, 0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "500px", height: "500px", background: "rgba(249, 115, 22, 0.05)", borderRadius: "50%", filter: "blur(80px)" }} />
        
        <div style={{ zIndex: 1, maxWidth: "800px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src="/pd.png" alt="Logo BPBD" style={{ width: "96px", height: "96px", marginBottom: "24px", objectFit: "contain", animation: "slideUp 0.8s ease-out" }} />
          
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, lineHeight: "1.1", marginBottom: "16px", letterSpacing: "-1px", animation: "slideUp 1s ease-out" }}>
            Sistem Informasi Manajemen Logistik & Peralatan
          </h1>
          
          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--fg-muted)", marginBottom: "40px", lineHeight: "1.6", maxWidth: "600px", animation: "slideUp 1.2s ease-out" }}>
            Badan Penanggulangan Bencana Daerah Kota Probolinggo. Memantau, mengelola, dan mendistribusikan bantuan secara akurat, transparan, dan real-time.
          </p>
          
          <div style={{ animation: "slideUp 1.4s ease-out" }}>
            <Link href="/dashboard" className="landing-btn">
              Masuk ke Sistem <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", width: "100%", maxWidth: "1000px", marginTop: "80px", zIndex: 1, animation: "slideUp 1.6s ease-out" }}>
          <div className="feature-card">
            <div style={{ background: "rgba(249, 115, 22, 0.1)", color: "#f97316", width: "56px", height: "56px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <Box size={28} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Manajemen Stok</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-muted)", lineHeight: "1.5" }}>Pantau jumlah dan nilai aset logistik serta peralatan dengan mudah.</p>
          </div>
          
          <div className="feature-card">
            <div style={{ background: "rgba(249, 115, 22, 0.1)", color: "#f97316", width: "56px", height: "56px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Distribusi Cepat</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-muted)", lineHeight: "1.5" }}>Rekap riwayat penerimaan dan penyaluran bantuan secara real-time.</p>
          </div>
          
          <div className="feature-card">
            <div style={{ background: "rgba(249, 115, 22, 0.1)", color: "#f97316", width: "56px", height: "56px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Data Akurat & Aman</h3>
            <p style={{ fontSize: "14px", color: "var(--fg-muted)", lineHeight: "1.5" }}>Tersimpan secara aman di sistem cloud dengan kontrol akses multi-peran.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
