"use client";

import { CheckCircle } from "lucide-react";

interface SuccessAlertProps {
  message: string;
}

export default function SuccessAlert({ message }: SuccessAlertProps) {
  return (
    <div style={{
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "8px",
      padding: "14px 18px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}>
      <div style={{
        background: "#22c55e",
        borderRadius: "50%",
        width: "28px",
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <CheckCircle size={18} color="white" strokeWidth={2.5} />
      </div>
      <p style={{
        margin: 0,
        fontSize: "12px",
        color: "#1a1a1aff",
        lineHeight: "1.5",
      }}>
        <strong style={{ fontWeight: 500 }}>Data Saved Successfully!</strong>{" "}
        <span style={{ color: "rgba(0, 0, 0, 1)ff" }}>{message}</span>
      </p>
    </div>
  );
}
