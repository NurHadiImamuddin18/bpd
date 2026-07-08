"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Cloud, CloudRain, Sun, CloudLightning, Wind, Droplets, ChevronRight, ArrowLeft } from "lucide-react";
import { getScene } from "./WeatherWidget";

export default function WeatherSearch() {
  const [query, setQuery] = useState("");
  const [mapQuery, setMapQuery] = useState("Indonesia");
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lon: number} | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchSuggestions = async (q: string) => {
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q.trim())}&count=5&language=id&format=json`);
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        setSuggestions(json.results);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const getFullName = (loc: any) => {
    // loc.name = Desa/Kecamatan, loc.admin2 = Kabupaten/Kota, loc.admin1 = Provinsi
    return [loc.name, loc.admin2, loc.admin1].filter(Boolean).join(", ");
  };

  const selectLocation = (loc: any) => {
    const fullName = getFullName(loc);
    setQuery(fullName);
    setMapQuery(fullName);
    setSelectedCoords({ lat: loc.latitude, lon: loc.longitude });
    setLocationName(fullName);
    setShowDropdown(false);
  };

  const fetchWeather = async () => {
    if (!selectedCoords) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCoords.lat}&longitude=${selectedCoords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
      const json = await res.json();
      setWeatherData(json.current);
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
      
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ position: "relative", marginBottom: "12px", zIndex: 50 }} ref={dropdownRef}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--fg-muted)" }} />
            <input 
              type="text" 
              placeholder="Ketik desa atau kota..." 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value) {
                   setSelectedCoords(null);
                   setLocationName("");
                   setWeatherData(null);
                }
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              style={{ width: "100%", paddingLeft: "34px", height: "36px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", background: "var(--bg)", outline: "none", color: "var(--fg-dark)" }}
            />
          </div>

          {/* Dropdown Suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px", background: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid var(--border)", overflow: "hidden", zIndex: 100 }}>
              {suggestions.map((loc) => (
                <div 
                  key={loc.id}
                  onClick={() => selectLocation(loc)}
                  style={{ padding: "10px 12px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: "12px", color: "#333", display: "flex", alignItems: "center", gap: "8px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <MapPin size={12} color="#888" />
                  <span>{getFullName(loc)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Container */}
        <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", flex: 1, minHeight: "300px", zIndex: 1, marginBottom: "12px" }}>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=${selectedCoords ? 15 : (mapQuery === 'Indonesia' ? 5 : 12)}&ie=UTF8&iwloc=&output=embed`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Scene Background over Map */}
          {weatherData && (
            <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
              {getScene(weatherData.weather_code, true)}
            </div>
          )}
        </div>

        {/* Selected Location Controls - Show if weather is not currently showing */}
        {selectedCoords && !weatherData && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-subtle)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
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

        {/* Weather Data Box */}
        {weatherData && (
          <div style={{ 
            background: "var(--bg-subtle)", 
            borderRadius: "12px", 
            border: "1px solid var(--border)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "20px" 
          }}>
            <div style={{ fontSize: "12px", color: "var(--fg-dark)", marginBottom: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} /> {locationName || `${selectedCoords?.lat.toFixed(4)}, ${selectedCoords?.lon.toFixed(4)}`}
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              {getWeatherIcon(weatherData.weather_code)}
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--fg-dark)", lineHeight: 1 }}>
                {weatherData.temperature_2m}°C
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-dark)" }}>
                {getWeatherDesc(weatherData.weather_code)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "24px", width: "100%", justifyContent: "center", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <Wind size={16} color="var(--fg-dark)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.wind_speed_10m} km/j</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <Droplets size={16} color="var(--fg-dark)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.relative_humidity_2m}%</span>
              </div>
            </div>

            <button 
              onClick={() => setWeatherData(null)} 
              style={{ marginTop: "20px", background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}
            >
              Tutup Keterangan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
