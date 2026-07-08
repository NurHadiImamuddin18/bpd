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
    if (code === 0) return <Sun size={32} color="#f59e0b" />;
    if (code >= 1 && code <= 3) return <Cloud size={32} color="#64748b" />;
    if (code >= 51 && code <= 67) return <CloudRain size={32} color="#3b82f6" />;
    if (code >= 95) return <CloudLightning size={32} color="#8b5cf6" />;
    return <Cloud size={32} color="#64748b" />;
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 51 && code <= 67) return "Hujan";
    if (code >= 95) return "Badai Petir";
    return "Tidak diketahui";
  };

  if (loading) return <div className="card" style={{ padding: "16px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Memuat cuaca...</div>;
  if (!data) return <div className="card" style={{ padding: "16px", height: "100%" }}>Gagal memuat cuaca</div>;

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-dark)", marginBottom: "4px" }}>Cuaca Area Utama</h3>
      <p style={{ fontSize: "12px", color: "var(--fg-muted)", marginBottom: "16px" }}>Lat: {LAT}, Lon: {LON}</p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div style={{ background: "var(--bg-subtle)", padding: "12px", borderRadius: "16px" }}>
          {getWeatherIcon(data.weather_code)}
        </div>
        <div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--fg-dark)", lineHeight: 1 }}>
            {data.temperature_2m}°C
          </div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)", marginTop: "4px" }}>
            {getWeatherDesc(data.weather_code)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--fg-muted)", fontSize: "13px" }}>
          <Wind size={16} />
          <span style={{ fontWeight: 600 }}>{data.wind_speed_10m} km/j</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--fg-muted)", fontSize: "13px" }}>
          <Droplets size={16} />
          <span style={{ fontWeight: 600 }}>{data.relative_humidity_2m}%</span>
        </div>
      </div>
    </div>
  );
}
