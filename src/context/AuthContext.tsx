"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  role: "admin" | "user";
  setRole: (role: "admin" | "user") => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: "admin",
  setRole: () => {},
  isReady: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<"admin" | "user">("admin");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("bpd_role");
    if (savedRole === "user" || savedRole === "admin") {
      setRoleState(savedRole);
    }
    setIsReady(true);
  }, []);

  const setRole = (newRole: "admin" | "user") => {
    setRoleState(newRole);
    localStorage.setItem("bpd_role", newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}
