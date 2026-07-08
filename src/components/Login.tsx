"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | Badan Penanggulangan Bencana Daerah Kota Probolinggo";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const success = await login(username, password);
    if (!success) {
      setError("Username atau password salah!");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      fontFamily: "var(--font)",
    }}>
      <div style={{
        background: "#ffffff",
        width: "100%",
        maxWidth: "400px",
        padding: "48px 40px",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <img src="/pd.png" alt="Logo" style={{ width: "64px", height: "64px", marginBottom: "16px", objectFit: "contain" }} />
        
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-dark)", textAlign: "center", marginBottom: "4px" }}>
          Managemen Gudang
        </h1>
        <p style={{ fontSize: "13px", color: "var(--fg-muted)", textAlign: "center", marginBottom: "32px", lineHeight: "1.5" }}>
          Badan Penanggulangan Bencana Daerah<br/>Kota Probolinggo
        </p>

        {error && (
          <div style={{ width: "100%", background: "#fee2e2", color: "#b91c1c", padding: "12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--fg)", marginBottom: "6px" }}>Username</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              style={{
                width: "100%", padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", color: "var(--fg-dark)", outline: "none", transition: "border 0.2s"
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--fg)", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", color: "var(--fg-dark)", outline: "none", transition: "border 0.2s"
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--fg-dark)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              transition: "opacity 0.2s"
            }}
          >
            {loading ? "Memverifikasi..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "32px", fontSize: "11px", color: "var(--fg-muted)", textAlign: "center" }}>
          Sistem Informasi Manajemen Logistik<br/>BPBD Kota Probolinggo &copy; 2026
        </p>
      </div>
    </div>
  );
}
