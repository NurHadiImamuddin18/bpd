import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Badan Penanggulangan Bencana Daerah Kota Probolinggo",
};

export default function LandingPage() {
  return (
    <div style={{ 
      fontFamily: "var(--font)", 
      color: "#111", 
      overflowX: "hidden", 
      minHeight: "100vh", 
      backgroundColor: "#ffffff",
      backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, #ffffff 40%)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "24px" 
    }}>
      <style>{`
        .landing-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #000000;
          color: white;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 500;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .landing-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          background: #1a1a1a;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={{ zIndex: 1, maxWidth: "800px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        <h1 className="animate-fade-in-up" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, lineHeight: "1.1", marginBottom: "16px", letterSpacing: "-1px" }}>
          Warehouse Management
        </h1>
        
        <p className="animate-fade-in-up" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#555", marginBottom: "48px", lineHeight: "1.6", maxWidth: "600px", animationDelay: "0.1s" }}>
          Regional Disaster Management Agency of Probolinggo City
        </p>
        
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Link href="/dashboard" className="landing-btn">
            Get started <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
