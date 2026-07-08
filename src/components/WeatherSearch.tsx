"use client";

import { useState } from "react";
import { Search, MapPin, Cloud, CloudRain, Sun, CloudLightning, Wind, Droplets, ChevronRight, ArrowLeft } from "lucide-react";

export default function WeatherSearch() {
  const [query, setQuery] = useState("");
  const [mapQuery, setMapQuery] = useState("Indonesia");
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lon: number} | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [locationName, setLocationName] = useState("");

  const searchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setMapQuery(query.trim());
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=1&language=id&format=json`);
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        const loc = json.results[0];
        setSelectedCoords({ lat: loc.latitude, lon: loc.longitude });
        setLocationName(`${loc.name}, ${loc.admin1 || ""} ${loc.country || ""}`);
      } else {
        setSelectedCoords(null);
        setLocationName("");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    if (!selectedCoords) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCoords.lat}&longitude=${selectedCoords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
      const json = await res.json();
      setWeatherData(json.current);
      setStep(2);
    } catch (error) {
      console.error("Weather fetch error:", error);
      alert("Gagal mengambil data cuaca.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun size={28} color="#f59e0b" />;
    if (code >= 1 && code <= 3) return <Cloud size={28} color="#64748b" />;
    if (code >= 51 && code <= 67) return <CloudRain size={28} color="#3b82f6" />;
    if (code >= 95) return <CloudLightning size={28} color="#8b5cf6" />;
    return <Cloud size={28} color="#64748b" />;
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 51 && code <= 67) return "Hujan";
    if (code >= 95) return "Badai Petir";
    return "Tidak diketahui";
  };

  return (
    <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--fg-dark)", marginBottom: "16px" }}>Cek Cuaca via Peta</h3>
      
      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <form onSubmit={searchLocation} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)" }} />
              <input 
                type="text" 
                placeholder="Cari lokasi..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", paddingLeft: "34px", height: "36px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "var(--bg)", outline: "none" }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ background: "var(--fg-dark)", color: "white", border: "none", borderRadius: "8px", padding: "0 14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={16} />
            </button>
          </form>

          <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", flex: 1, minHeight: "200px" }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
              style={{ width: "100%", height: "100%", border: "none", minHeight: "200px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {selectedCoords && (
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-subtle)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "12px", color: "var(--fg-dark)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                  <MapPin size={12} color="var(--fg-muted)" />
                  <span style={{ fontWeight: 600 }}>{locationName}</span>
                </div>
                <span style={{ color: "var(--fg-muted)" }}>{selectedCoords.lat.toFixed(4)}, {selectedCoords.lon.toFixed(4)}</span>
              </div>
              <button 
                onClick={fetchWeather}
                disabled={loading}
                style={{ background: "var(--fg-dark)", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600 }}
              >
                {loading ? "Memuat..." : "Next"} <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <button 
            onClick={() => setStep(1)}
            style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "4px", color: "var(--fg-muted)", cursor: "pointer", fontSize: "12px", padding: 0, marginBottom: "16px", fontWeight: 600 }}
          >
            <ArrowLeft size={14} /> Kembali ke Peta
          </button>

          {weatherData && (
            <div style={{ background: "var(--bg-subtle)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center" }}>
              <div style={{ fontSize: "12px", color: "var(--fg-muted)", marginBottom: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} /> {locationName || `${selectedCoords?.lat.toFixed(4)}, ${selectedCoords?.lon.toFixed(4)}`}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                {getWeatherIcon(weatherData.weather_code)}
                <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--fg-dark)", lineHeight: 1 }}>
                  {weatherData.temperature_2m}°C
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-muted)" }}>
                  {getWeatherDesc(weatherData.weather_code)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "24px", width: "100%", justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <Wind size={16} color="var(--fg-muted)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.wind_speed_10m} km/j</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <Droplets size={16} color="var(--fg-muted)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.relative_humidity_2m}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
