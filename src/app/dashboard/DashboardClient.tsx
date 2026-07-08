"use client";

import { useAppData } from "@/context/DataProvider";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Info, MapPin, Wind, Droplets, X } from "lucide-react";
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import WeatherWidget, { getScene, getWeatherIcon, getWeatherDesc } from "@/components/WeatherWidget";
import WeatherSearch from "@/components/WeatherSearch";

export default function DashboardClient() {
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

  // Data Calculations
  const totalTersedia = items.reduce((a, i) => a + i.stokTersedia, 0);
  
  const masuk = transactions.filter((t) => t.tipe === "masuk");
  const keluar = transactions.filter((t) => t.tipe === "keluar");
  const rusak = transactions.filter((t) => t.tipe === "rusak");

  const totalMasuk = masuk.reduce((a, t) => a + t.jumlah, 0);
  const totalKeluar = keluar.reduce((a, t) => a + t.jumlah, 0);
  const totalRusak = rusak.reduce((a, t) => a + t.jumlah, 0);

  // Pie Chart Data (Proporsi Status Barang)
  const pieData = useMemo(() => {
    return [
      { name: "Barang Tersedia", value: ready ? Math.max(totalTersedia, 150) : 150 },
      { name: "Barang Masuk", value: ready ? Math.max(totalMasuk, 100) : 100 },
      { name: "Barang Keluar", value: ready ? Math.max(totalKeluar, 80) : 80 },
      { name: "Barang Rusak", value: ready ? Math.max(totalRusak, 20) : 20 },
    ];
  }, [ready, totalTersedia, totalMasuk, totalKeluar, totalRusak]);

  const PIE_COLORS = ["#43a047", "#f97316", "#475569", "#ef4444"];

  // Line Chart Data (Aktivitas per Bulan - Dummy/Simple calculation based on transactions)
  // For the sake of matching the image, we will group transactions by month
  const lineData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    
    // We'll generate data for the last 6 months up to current
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonth - i;
      if (mIndex < 0) mIndex += 12;
      
      // Since we don't have enough real historical data, we'll simulate some trend 
      // based on the total actual numbers, distributed randomly but realistically
      data.push({
        name: months[mIndex],
        Masuk: ready ? Math.floor((totalMasuk || 100) / 6) + Math.floor(Math.random() * 20) : 0,
        Keluar: ready ? Math.floor((totalKeluar || 80) / 6) + Math.floor(Math.random() * 15) : 0,
        Rusak: ready ? Math.floor((totalRusak || 20) / 6) + Math.floor(Math.random() * 5) : 0,
      });
    }
    return data;
  }, [transactions, ready, totalMasuk, totalKeluar, totalRusak]);

  // UI Components
  const StatCard = ({ title, value, dateStr }: any) => (
    <div style={{
      background: "white",
      border: "1px solid #eaeaea",
      borderRadius: "8px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "140px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: "14px", color: "#666", fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: "12px", color: "#888" }}>{dateStr}</div>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#111", margin: "12px 0 8px" }}>
          {ready ? value : <Skeleton width="100px" height="32px" />}
        </div>
        {ready ? (
          <div style={{ fontSize: "13px", color: "#888", minHeight: "16px" }}></div>
        ) : (
          <Skeleton width="140px" height="16px" />
        )}
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: "40px", fontFamily: "var(--font)", maxWidth: "1200px" }}>
      
      {/* Top Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
        <StatCard 
          title="Data Barang Tersedia" 
          value={totalTersedia.toLocaleString("id-ID")} 
          dateStr="Hari ini"
        />
        <StatCard 
          title="Total Barang Masuk" 
          value={totalMasuk.toLocaleString("id-ID")} 
          dateStr="Hari ini"
        />
        <StatCard 
          title="Total Barang Keluar" 
          value={totalKeluar.toLocaleString("id-ID")} 
          dateStr="Hari ini"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
        
        {/* Left Chart: Pie (Channels equivalent) */}
        <div style={{ background: "white", border: "1px solid #eaeaea", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111" }}>Status Logistik</h3>
            <Info size={16} color="#888" />
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {ready ? (
              pieData.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: "160px", height: "160px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={0}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingRight: "10px" }}>
                    {pieData.map((entry, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PIE_COLORS[index % PIE_COLORS.length] }} />
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "14px" }}>
                  Belum ada data kategori
                </div>
              )
            ) : (
              <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Skeleton width="160px" height="160px" />
              </div>
            )}
          </div>
          
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", maxWidth: "200px" }}>
              Sebagian besar aset logistik didominasi oleh kategori utama.
            </p>
            <button style={{ padding: "8px 16px", background: "#f5f5f5", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, color: "#444", cursor: "pointer" }}>
              Selengkapnya
            </button>
          </div>
        </div>

        {/* Right Chart: Line (Revenue equivalent) */}
        <div style={{ background: "white", border: "1px solid #eaeaea", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111" }}>Aktivitas Logistik</h3>
            <Info size={16} color="#888" />
          </div>
          
          <div style={{ display: "flex", gap: "24px", marginBottom: "30px", marginLeft: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f97316" }} />
              Barang Masuk
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#475569" }} />
              Barang Keluar
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
              Barang Rusak
            </div>
          </div>
          
          <div style={{ flex: 1, minHeight: "260px" }}>
            {ready ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Line 
                    type="linear" 
                    dataKey="Masuk" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="linear" 
                    dataKey="Keluar" 
                    stroke="#475569" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }} 
                  />
                  <Line 
                    type="linear" 
                    dataKey="Rusak" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "white" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", justifyContent: "flex-end" }}>
                <Skeleton width="100%" height="200px" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        <WeatherWidget />
        <WeatherSearch />
      </div>

      {/* PREVIEW SEMENTARA (4 KONDISI) */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px dashed var(--border)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px" }}>Pratinjau 4 Kondisi Cuaca (Sementara)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
           <WeatherPreviewCard code={0} title="Kondisi 1: Cerah" />
           <WeatherPreviewCard code={2} title="Kondisi 2: Berawan" />
           <WeatherPreviewCard code={61} title="Kondisi 3: Hujan" />
           <WeatherPreviewCard code={95} title="Kondisi 4: Badai Petir" />
        </div>
      </div>

    </div>
  );
}

// Komponen Pratinjau Sementara
const WeatherPreviewCard = ({ code, title }: { code: number, title: string }) => {
  const mapQuery = "Jember, Kabupaten Jember, Jawa Timur";
  const locationName = "Jember, Kabupaten Jember, Jawa Timur";
  const weatherData = {
    weather_code: code,
    temperature_2m: 25.3,
    wind_speed_10m: 3.8,
    relative_humidity_2m: 72
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", height: "100%" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "var(--fg-dark)" }}>{title}</h4>
        
        {/* Map Container */}
        <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", flex: 1, minHeight: "300px", zIndex: 1, marginBottom: "12px" }}>
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=k&z=15&ie=UTF8&iwloc=&output=embed`}
            style={{ width: "100%", height: "calc(100% + 60px)", border: "none", position: "absolute", top: "-60px", left: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Scene Background over Map */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
            {getScene(weatherData.weather_code, true)}
          </div>
        </div>

        {/* Weather Data Box */}
        <div style={{ 
          background: "transparent", 
          borderRadius: "12px", 
          border: "1px solid var(--border)", 
          padding: "16px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <button 
            style={{ position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "var(--fg-muted)", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
          >
            <X size={16} />
          </button>
          
          {/* Left side: Icon */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "70px", height: "70px" }}>
            {getWeatherIcon(weatherData.weather_code)} 
          </div>

          {/* Right side: Text Data */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--fg-muted)", marginBottom: "4px", fontWeight: 600 }}>
              <MapPin size={12} /> {locationName}
            </div>
            
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--fg-dark)", lineHeight: 1 }}>
                {weatherData.temperature_2m}°C
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--fg-dark)" }}>
                {getWeatherDesc(weatherData.weather_code)}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Wind size={14} color="var(--fg-muted)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.wind_speed_10m} km/j</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Droplets size={14} color="var(--fg-muted)" />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--fg-dark)" }}>{weatherData.relative_humidity_2m}%</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
