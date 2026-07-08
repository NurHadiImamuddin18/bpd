"use client";

import { useEffect, useState } from "react";
import { Wind, Droplets } from "lucide-react";

const LAT = -7.7541377;
const LON = 113.1952448;

/* ─── Pure CSS/SVG Walking BPBD Officer ─── */
const BPBDOfficer = () => (
  <svg viewBox="0 0 80 120" style={{ width: "100%", height: "100%" }}>
    <style>{`
      .walk-body { animation: walk-bounce 0.6s ease-in-out infinite; transform-origin: 40px 50px; }
      @keyframes walk-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      .walk-left-leg { animation: left-leg 0.6s ease-in-out infinite; transform-origin: 38px 85px; }
      .walk-right-leg { animation: right-leg 0.6s ease-in-out infinite; transform-origin: 42px 85px; }
      @keyframes left-leg { 0% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } 100% { transform: rotate(-15deg); } }
      @keyframes right-leg { 0% { transform: rotate(15deg); } 50% { transform: rotate(-15deg); } 100% { transform: rotate(15deg); } }
      .walk-left-arm { animation: left-arm 0.6s ease-in-out infinite; transform-origin: 30px 55px; }
      .walk-right-arm { animation: right-arm 0.6s ease-in-out infinite; transform-origin: 50px 55px; }
      @keyframes left-arm { 0% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } 100% { transform: rotate(20deg); } }
      @keyframes right-arm { 0% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } 100% { transform: rotate(-20deg); } }
    `}</style>
    <g className="walk-body">
      {/* Helmet */}
      <ellipse cx="40" cy="22" rx="16" ry="12" fill="#f97316" />
      <rect x="24" y="22" width="32" height="4" rx="2" fill="#ea580c" />
      <rect x="36" y="12" width="8" height="4" rx="2" fill="#fbbf24" /> {/* lamp */}
      {/* Face */}
      <circle cx="40" cy="32" r="10" fill="#fcd9b6" />
      <circle cx="36" cy="30" r="1.5" fill="#333" /> {/* left eye */}
      <circle cx="44" cy="30" r="1.5" fill="#333" /> {/* right eye */}
      <path d="M37 35 Q40 38 43 35" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" /> {/* smile */}
      {/* Body / Vest */}
      <rect x="30" y="42" width="20" height="25" rx="4" fill="#f97316" />
      <rect x="37" y="42" width="6" height="25" rx="1" fill="#ea580c" /> {/* vest center */}
      <rect x="32" y="48" width="16" height="3" rx="1" fill="#fbbf24" opacity="0.6" /> {/* reflective strip */}
      <rect x="32" y="56" width="16" height="3" rx="1" fill="#fbbf24" opacity="0.6" /> {/* reflective strip */}
      {/* Belt */}
      <rect x="30" y="64" width="20" height="3" rx="1" fill="#44403c" />
    </g>
    {/* Left Arm */}
    <g className="walk-left-arm">
      <rect x="23" y="45" width="8" height="22" rx="4" fill="#f97316" />
      <circle cx="27" cy="68" r="4" fill="#fcd9b6" /> {/* hand */}
    </g>
    {/* Right Arm */}
    <g className="walk-right-arm">
      <rect x="49" y="45" width="8" height="22" rx="4" fill="#f97316" />
      <circle cx="53" cy="68" r="4" fill="#fcd9b6" /> {/* hand */}
    </g>
    {/* Left Leg */}
    <g className="walk-left-leg">
      <rect x="32" y="67" width="8" height="24" rx="4" fill="#1e3a5f" /> {/* pants */}
      <rect x="30" y="88" width="12" height="6" rx="3" fill="#1c1917" /> {/* boot */}
    </g>
    {/* Right Leg */}
    <g className="walk-right-leg">
      <rect x="40" y="67" width="8" height="24" rx="4" fill="#1e3a5f" /> {/* pants */}
      <rect x="38" y="88" width="12" height="6" rx="3" fill="#1c1917" /> {/* boot */}
    </g>
  </svg>
);

/* ─── Rain drops animation ─── */
const RainEffect = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <style>{`
      .raindrop { position: absolute; width: 2px; background: linear-gradient(to bottom, transparent, rgba(59,130,246,0.5)); border-radius: 0 0 2px 2px; animation: fall linear infinite; }
      @keyframes fall { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(400px); opacity: 0.3; } }
      .splash { position: absolute; bottom: 16px; width: 6px; height: 3px; border-radius: 50%; background: rgba(59,130,246,0.3); animation: splash-anim 1.2s ease-out infinite; }
      @keyframes splash-anim { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
    `}</style>
    {Array.from({ length: 25 }).map((_, i) => (
      <div key={`r${i}`} className="raindrop" style={{
        left: `${(i * 4.2) % 100}%`,
        height: `${14 + (i % 5) * 4}px`,
        animationDuration: `${0.5 + (i % 4) * 0.15}s`,
        animationDelay: `${(i * 0.08) % 1}s`,
      }} />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={`s${i}`} className="splash" style={{
        left: `${5 + i * 12}%`,
        animationDelay: `${i * 0.15}s`,
      }} />
    ))}
  </div>
);

/* ─── Cloud animation ─── */
const CloudEffect = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <style>{`
      .cloud-shape { position: absolute; background: rgba(148,163,184,0.12); border-radius: 50px; animation: drift linear infinite; }
      @keyframes drift { 0% { transform: translateX(-120px); } 100% { transform: translateX(calc(100vw + 50px)); } }
    `}</style>
    <div className="cloud-shape" style={{ top: "10px", width: "70px", height: "22px", animationDuration: "12s", boxShadow: "18px -8px 0 6px rgba(148,163,184,0.12), 40px -4px 0 4px rgba(148,163,184,0.12)" }} />
    <div className="cloud-shape" style={{ top: "40px", width: "50px", height: "16px", animationDuration: "16s", animationDelay: "4s", boxShadow: "14px -6px 0 4px rgba(148,163,184,0.12), 30px -3px 0 3px rgba(148,163,184,0.12)" }} />
    <div className="cloud-shape" style={{ top: "25px", width: "60px", height: "18px", animationDuration: "20s", animationDelay: "8s", boxShadow: "16px -7px 0 5px rgba(148,163,184,0.12), 35px -3px 0 4px rgba(148,163,184,0.12)" }} />
  </div>
);

/* ─── Storm / Lightning ─── */
const StormEffect = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <style>{`
      .lightning-flash { position: absolute; inset: 0; background: rgba(255,255,255,0); animation: flash 4s infinite; }
      @keyframes flash { 0%,90%,94%,100% { background: rgba(255,255,255,0); } 91%,93% { background: rgba(203,213,225,0.4); } 92% { background: rgba(255,255,255,0.2); } }
      .bolt { position: absolute; animation: bolt-flicker 4s infinite; }
      @keyframes bolt-flicker { 0%,89%,95%,100% { opacity: 0; } 90%,94% { opacity: 1; } }
    `}</style>
    <div className="lightning-flash" />
    <svg className="bolt" style={{ top: "5px", right: "30px", width: "24px", height: "40px" }} viewBox="0 0 24 40">
      <polygon points="14,0 6,18 12,18 8,40 20,15 13,15 18,0" fill="#fbbf24" opacity="0.8" />
    </svg>
    {/* Also add rain for storm */}
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={`sr${i}`} style={{
        position: "absolute",
        left: `${(i * 5.3) % 100}%`,
        width: "2px",
        height: `${16 + (i % 4) * 5}px`,
        background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.4))",
        borderRadius: "0 0 2px 2px",
        animation: `fall ${0.4 + (i % 3) * 0.1}s linear infinite`,
        animationDelay: `${(i * 0.07) % 0.8}s`,
      }} />
    ))}
  </div>
);

/* ─── Sunshine / Clear ─── */
const ClearEffect = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <style>{`
      .sun-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.08) 40%, transparent 70%); animation: sun-breathe 3s ease-in-out infinite; }
      @keyframes sun-breathe { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
      .sun-ray { position: absolute; top: 5px; right: 5px; width: 4px; height: 16px; background: rgba(251,191,36,0.2); border-radius: 2px; transform-origin: 2px 40px; animation: ray-spin 12s linear infinite; }
      @keyframes ray-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
    <div className="sun-glow" />
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={`ray${i}`} className="sun-ray" style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${i * 0.3}s` }} />
    ))}
  </div>
);

export default function WeatherWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        const json = await res.json();
        setData(json.current);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 51 && code <= 67) return "Hujan";
    if (code >= 80 && code <= 82) return "Hujan Lebat";
    if (code >= 95) return "Badai Petir";
    return "Berawan";
  };

  const getWeatherEffect = (code: number) => {
    if (code >= 95) return <StormEffect />;
    if (code >= 51 && code <= 82) return <RainEffect />;
    if (code >= 1 && code <= 3) return <CloudEffect />;
    return <ClearEffect />;
  };

  const getWeatherEmoji = (code: number) => {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 51 && code <= 82) return "🌧️";
    if (code >= 95) return "⛈️";
    return "⛅";
  };

  if (loading) return (
    <div className="card" style={{ padding: "20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
      <div style={{ textAlign: "center", color: "#888" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px", animation: "pulse 1.5s infinite" }}>🌤️</div>
        Memuat cuaca...
      </div>
    </div>
  );

  if (!data) return <div className="card" style={{ padding: "20px", height: "100%", background: "white" }}>Gagal memuat cuaca</div>;

  return (
    <div className="card" style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "white",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    }}>
      {/* Weather Effect Layer */}
      {getWeatherEffect(data.weather_code)}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111", marginBottom: "4px", lineHeight: 1.3 }}>
          Cuaca Daerah Badan Penanggulangan Bencana Daerah Kota Probolinggo
        </h3>
        <p style={{ fontSize: "11px", color: "#999", marginBottom: "16px" }}>
          Lat: {LAT}, Lon: {LON}
        </p>

        {/* Main content: Weather info + Officer */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          {/* Left side: temperature */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px" }}>{getWeatherEmoji(data.weather_code)}</span>
              <div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#111", lineHeight: 1 }}>
                  {data.temperature_2m}°C
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#666", marginTop: "2px" }}>
                  {getWeatherDesc(data.weather_code)}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Walking BPBD Officer */}
          <div style={{ width: "90px", height: "110px", flexShrink: 0 }}>
            <BPBDOfficer />
          </div>
        </div>

        {/* Footer stats */}
        <div style={{ display: "flex", gap: "16px", borderTop: "1px solid #f0f0f0", paddingTop: "12px", marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#888", fontSize: "13px" }}>
            <Wind size={15} />
            <span style={{ fontWeight: 600 }}>{data.wind_speed_10m} km/j</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#888", fontSize: "13px" }}>
            <Droplets size={15} />
            <span style={{ fontWeight: 600 }}>{data.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
