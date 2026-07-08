"use client";

import { useEffect, useState } from "react";
import { Wind, Droplets } from "lucide-react";

export const LAT = -7.7541377;
export const LON = 113.1952448;

/* ═══════════════════════════════════════════════
   MINIMALIST SCENES
   ═══════════════════════════════════════════════ */
const SceneClear = () => (
  <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="bg-clear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.1" />
      </linearGradient>
      <radialGradient id="sun-glow" cx="1" cy="0" r="1">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <style>{`
      .bird { animation: bird-fly 15s linear infinite; }
      @keyframes bird-fly { 0% { transform: translateX(-50px); } 100% { transform: translateX(450px); } }
    `}</style>
    
    {/* Background */}
    <rect width="400" height="200" fill="url(#bg-clear)" />
    
    {/* Subtle Sun Glow Top Right */}
    <rect width="400" height="200" fill="url(#sun-glow)" />

    {/* Slow Birds */}
    <g className="bird" stroke="#0284c7" strokeWidth="1.5" fill="none" opacity="0.4">
      <path d="M 50 40 Q 55 35 60 40 Q 65 35 70 40" />
      <path d="M 80 50 Q 85 45 90 50 Q 95 45 100 50" style={{ animationDelay: "2s" }} />
    </g>
  </svg>
);

const SceneCloudy = () => (
  <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="bg-cloudy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <style>{`
      .cloud-dr { animation: cloud-drift 20s linear infinite; }
      @keyframes cloud-drift { 0% { transform: translateX(-100px); } 100% { transform: translateX(500px); } }
      .bird { animation: bird-fly 12s linear infinite; }
      @keyframes bird-fly { 0% { transform: translateX(-50px); } 100% { transform: translateX(450px); } }
    `}</style>

    <rect width="400" height="200" fill="url(#bg-cloudy)" />
    
    {/* Clouds */}
    <g className="cloud-dr" fill="#f1f5f9" opacity="0.6">
      <ellipse cx="100" cy="40" rx="40" ry="15" />
      <ellipse cx="120" cy="35" rx="30" ry="12" />
      <ellipse cx="80" cy="38" rx="25" ry="10" />
    </g>
    <g className="cloud-dr" fill="#f8fafc" opacity="0.4" style={{ animationDelay: "-10s", animationDuration: "25s" }}>
      <ellipse cx="300" cy="60" rx="50" ry="18" />
      <ellipse cx="270" cy="55" rx="35" ry="15" />
    </g>

    {/* Birds */}
    <g className="bird" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.4">
      <path d="M 50 40 Q 55 35 60 40 Q 65 35 70 40" />
    </g>
  </svg>
);

const SceneRain = () => (
  <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="bg-rain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <style>{`
      .rain-drop { animation: rain-fall linear infinite; }
      @keyframes rain-fall { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(220px); opacity: 0.2; } }
      .bird-fast { animation: bird-fly-fast 3s linear infinite; }
      @keyframes bird-fly-fast { 0% { transform: translateX(-50px); } 100% { transform: translateX(450px); } }
    `}</style>

    <rect width="400" height="200" fill="url(#bg-rain)" />
    
    {/* Fast Birds fleeing rain */}
    <g className="bird-fast" stroke="#475569" strokeWidth="1.5" fill="none" opacity="0.6">
      <path d="M 50 60 Q 55 58 60 60 Q 65 58 70 60" />
      <path d="M 30 70 Q 35 68 40 70 Q 45 68 50 70" />
    </g>

    {/* Rain drops */}
    {Array.from({length: 40}).map((_,i) => (
      <line key={i} className="rain-drop"
        x1={10 + (i*21)%390} y1="0" x2={5 + (i*21)%390} y2={15 + (i%3)*5}
        stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
        style={{ animationDuration: `${0.4 + (i%5)*0.1}s`, animationDelay: `${(i*0.05)%0.8}s` }}
      />
    ))}
  </svg>
);

const SceneStorm = () => (
  <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <linearGradient id="bg-storm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#64748b" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <style>{`
      .storm-flash { animation: flash 4s infinite; }
      @keyframes flash { 0%,88%,92%,96%,100% { opacity: 0; } 89%,93% { opacity: 0.8; } 90% { opacity: 1; } }
      .rain-heavy { animation: rain-fall-heavy linear infinite; }
      @keyframes rain-fall-heavy { 0% { transform: translateY(-20px); opacity: 1; } 100% { transform: translateY(220px); opacity: 0.1; } }
      .bird-super-fast { animation: bird-fly-sfast 1.5s linear infinite; }
      @keyframes bird-fly-sfast { 0% { transform: translateX(-50px) translateY(10px); } 100% { transform: translateX(450px) translateY(-10px); } }
    `}</style>

    <rect width="400" height="200" fill="url(#bg-storm)" />
    <rect width="400" height="200" fill="rgba(255,255,255,0.8)" className="storm-flash" />

    {/* Very Fast Birds fleeing storm */}
    <g className="bird-super-fast" stroke="#334155" strokeWidth="2" fill="none" opacity="0.7">
      <path d="M 50 80 Q 55 78 60 80 Q 65 78 70 80" />
      <path d="M 40 95 Q 45 93 50 95 Q 55 93 60 95" />
    </g>

    {/* Lightning */}
    <polygon points="200,0 180,60 195,60 170,120 210,50 195,50 215,0" fill="#fde047" className="storm-flash" opacity="0.8" />

    {/* Heavy Rain */}
    {Array.from({length: 60}).map((_,i) => (
      <line key={i} className="rain-heavy"
        x1={5 + (i*17)%395} y1="0" x2={-10 + (i*17)%395} y2={20 + (i%4)*5}
        stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.6"
        style={{ animationDuration: `${0.3 + (i%3)*0.05}s`, animationDelay: `${(i*0.03)%0.5}s` }}
      />
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════ */
export const getWeatherDesc = (code: number) => {
  if (code === 0) return "Cerah";
  if (code >= 1 && code <= 3) return "Berawan";
  if (code >= 51 && code <= 67) return "Hujan";
  if (code >= 80 && code <= 82) return "Hujan Lebat";
  if (code >= 95) return "Badai Petir";
  return "Berawan";
};

export const getScene = (code: number) => {
  if (code >= 95) return <SceneStorm />;
  if (code >= 51 && code <= 82) return <SceneRain />;
  if (code >= 1 && code <= 3) return <SceneCloudy />;
  return <SceneClear />;
};

export const getWeatherEmoji = (code: number) => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code >= 51 && code <= 82) return "🌧️";
  if (code >= 95) return "⛈️";
  return "⛅";
};

/* ═══════════════════════════════════════════════
   MAIN WEATHER WIDGET
   ═══════════════════════════════════════════════ */
export default function WeatherWidget({ overrideCode, overrideTemp }: { overrideCode?: number, overrideTemp?: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!overrideCode);

  useEffect(() => {
    if (overrideCode !== undefined) {
      setData({
        temperature_2m: overrideTemp || 28,
        relative_humidity_2m: 60,
        wind_speed_10m: 15,
        weather_code: overrideCode
      });
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
        if (!res.ok) throw new Error("API response not ok");
        const json = await res.json();
        setData(json.current);
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Fallback data if fetch fails
        setData({
          temperature_2m: 29.5,
          relative_humidity_2m: 65,
          weather_code: 1, // Berawan as default
          wind_speed_10m: 10.2,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [overrideCode, overrideTemp]);

  if (loading) return (
    <div className="card" style={{ padding: "20px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
      <div style={{ textAlign: "center", color: "#888" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌤️</div>
        Memuat cuaca...
      </div>
    </div>
  );

  if (!data) return null;

  // Text colors
  const textColor = "#0f172a";
  const mutedColor = "rgba(15, 23, 42, 0.7)";

  return (
    <div className="card" style={{
      padding: "0",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: "220px",
      position: "relative",
      overflow: "hidden",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}>
      {/* Absolute Background Scene */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {getScene(data.weather_code)}
      </div>

      {/* Content Overlay */}
      <div style={{ 
        position: "relative", 
        zIndex: 1, 
        padding: "24px", 
        display: "flex", 
        flexDirection: "column", 
        height: "100%",
        color: textColor 
      }}>
        
        {/* Main Temperature & Icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <span style={{ fontSize: "48px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
            {getWeatherEmoji(data.weather_code)}
          </span>
          <div>
            <div style={{ fontSize: "42px", fontWeight: 800, lineHeight: 1, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              {data.temperature_2m}°C
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, marginTop: "4px", color: mutedColor }}>
              {getWeatherDesc(data.weather_code)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: mutedColor }}>
            <Wind size={16} />
            <span>{data.wind_speed_10m} km/j</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: mutedColor }}>
            <Droplets size={16} />
            <span>{data.relative_humidity_2m}%</span>
          </div>
        </div>

        {/* Header moved to bottom */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            Cuaca Daerah BPBD Kota Probolinggo
          </h3>
          <p style={{ fontSize: "12px", margin: 0, color: mutedColor }}>
            {LAT}, {LON}
          </p>
        </div>
      </div>
    </div>
  );
}
