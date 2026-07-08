"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db, collection, query, where, getDocs, addDoc } from "@/lib/firebase";

interface AuthContextType {
  role: "Admin" | "User" | null;
  user: any;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  user: null,
  login: async () => false,
  logout: () => {},
  isReady: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<"Admin" | "User" | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("bpd_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session && session.role) {
          setRoleState(session.role);
          setUser(session);
        }
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
    setIsReady(true);
  }, []);

  const login = async (username: string, pass: string) => {
    // If admin is hardcoded for safety during migration
    if (username === "admin" && pass === "admin") {
      const session = { id: "admin-fallback", nama: "Admin Gudang", username: "admin", role: "Admin" };
      setRoleState("Admin");
      setUser(session);
      localStorage.setItem("bpd_session", JSON.stringify(session));
      return true;
    }

    if (username.trim() === "nurhadiimamuddin" && pass === "180105") {
      const session = { id: "nurhadi-fallback", nama: "Nur Hadi Imamuddin", username: "nurhadiimamuddin", role: "Admin" };
      setRoleState("Admin");
      setUser(session);
      localStorage.setItem("bpd_session", JSON.stringify(session));
      
      // Try to seed in background (non-blocking)
      setTimeout(async () => {
        try {
          const checkQ = query(collection(db, "users"), where("username", "==", "nurhadiimamuddin"));
          const snap = await getDocs(checkQ);
          if (snap.empty) {
            await addDoc(collection(db, "users"), {
              nama: "Nur Hadi Imamuddin",
              username: "nurhadiimamuddin",
              password: "180105",
              role: "Admin",
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.error("Background seed error", e);
        }
      }, 1000);

      return true;
    }

    try {
      const cleanUsername = username.trim();
      const q = query(
        collection(db, "users"),
        where("username", "==", cleanUsername),
        where("password", "==", pass)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        const session = { id: snap.docs[0].id, nama: docData.nama, username: docData.username, role: docData.role };
        setRoleState(docData.role);
        setUser(session);
        localStorage.setItem("bpd_session", JSON.stringify(session));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setRoleState(null);
    setUser(null);
    localStorage.removeItem("bpd_session");
  };

  return (
    <AuthContext.Provider value={{ role, user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
