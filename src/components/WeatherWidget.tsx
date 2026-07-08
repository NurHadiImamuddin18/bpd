"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudLightning, Wind, Droplets } from "lucide-react";

const LAT = -7.7541377;
const LON = 113.1952448;

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

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={32} color="#fcd34d" />;
    if (code >= 1 && code <= 3) return <Cloud size={32} color="#f8fafc" />;
    if (code >= 51 && code <= 67) return <CloudRain size={32} color="#93c5fd" />;
    if (code >= 95) return <CloudLightning size={32} color="#c4b5fd" />;
    return <Cloud size={32} color="#f8fafc" />;
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 51 && code <= 67) return "Hujan";
    if (code >= 95) return "Badai Petir";
    return "Tidak diketahui";
  };

  const getAnimationClass = (code: number) => {
    if (code >= 51 && code <= 67) return "weather-rain";
    if (code >= 95) return "weather-storm";
    if (code >= 1 && code <= 3) return "weather-cloudy";
    return "weather-clear";
  };

  if (loading) return <div className="card" style={{ padding: "16px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Memuat cuaca...</div>;
  if (!data) return <div className="card" style={{ padding: "16px", height: "100%" }}>Gagal memuat cuaca</div>;

  return (
    <div className={`card ${getAnimationClass(data.weather_code)}`} style={{ 
      position: "relative", 
      overflow: "hidden", 
      padding: "0", 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    }}>
      <style>{`
        .weather-rain::after { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="10" y1="0" x2="10" y2="10" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><line x1="50" y1="20" x2="50" y2="30" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><line x1="80" y1="10" x2="80" y2="20" stroke="rgba(255,255,255,0.4)" stroke-width="1"/></svg>') repeat; animation: rain-drop 0.5s linear infinite; z-index: 2; pointer-events: none; }
        @keyframes rain-drop { 0% { background-position: 0 0; } 100% { background-position: 0 100px; } }
        
        .weather-storm { animation: storm-flash 4s infinite; }
        @keyframes storm-flash { 0%, 95%, 98%, 100% { filter: brightness(1); } 96%, 99% { filter: brightness(2); } }
        
        .weather-cloudy::after { content: ""; position: absolute; top: 0; left: -100%; width: 200%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: cloud-move 8s linear infinite; z-index: 2; pointer-events: none; }
        @keyframes cloud-move { 0% { transform: translateX(0); } 100% { transform: translateX(50%); } }
        
        .weather-clear::after { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); animation: sun-pulse 4s ease-in-out infinite; z-index: 2; pointer-events: none; }
        @keyframes sun-pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }
      `}</style>
      
      {/* Satellite Map Background */}
      <iframe
        src={`https://maps.google.com/maps?q=${LAT},${LON}&t=k&z=12&ie=UTF8&iwloc=&output=embed`}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", zIndex: 0 }}
        loading="lazy"
      />
      
      {/* Dark Overlay to make text readable */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5))", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 3, padding: "20px", display: "flex", flexDirection: "column", height: "100%", color: "white" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          Cuaca Daerah Badan Penanggulangan Bencana Daerah Kota Probolinggo
        </h3>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", marginBottom: "16px" }}>Lat: {LAT}, Lon: {LON}</p>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "16px", backdropFilter: "blur(8px)" }}>
            {getWeatherIcon(data.weather_code)}
          </div>
          <div>
            <div style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
              {data.temperature_2m}°C
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginTop: "4px" }}>
              {getWeatherDesc(data.weather_code)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <Wind size={16} />
            <span style={{ fontWeight: 600 }}>{data.wind_speed_10m} km/j</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <Droplets size={16} />
            <span style={{ fontWeight: 600 }}>{data.relative_humidity_2m}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
