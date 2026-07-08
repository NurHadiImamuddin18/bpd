"use client";

import { useState } from "react";
import { useAppData } from "@/context/DataProvider";
import { db, collection, addDoc, deleteDoc, doc } from "@/lib/firebase";
import DataTable from "@/components/DataTable";
import { ReceiverItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DataPenerimaPage() {
  const { receivers, ready } = useAppData();
  const { role } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    instansi: "",
  });

  useEffect(() => {
    if (role === "User") {
      router.push("/masuk");
    }
  }, [role, router]);

  if (!ready || role === "User") return null;

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "receivers"), {
        ...form,
        createdAt: new Date().toISOString(),
      });
      setForm({ nama: "", kontak: "", instansi: "" });
      alert("Penerima berhasil ditambahkan!");
    } catch {
      alert("Gagal menambahkan penerima.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data penerima ini?")) {
      await deleteDoc(doc(db, "receivers", id));
    }
  };

  const columns = [
    {
      header: "Nama Penerima",
      accessorKey: "nama" as keyof ReceiverItem,
      cell: (item: ReceiverItem) => <span style={{ fontWeight: 600 }}>{item.nama}</span>,
    },
    { header: "Kontak", accessorKey: "kontak" as keyof ReceiverItem },
    { header: "Instansi / Alamat", accessorKey: "instansi" as keyof ReceiverItem },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className="page-title">Data Penerima</h1>
        <p className="page-subtitle">Kelola daftar penerima logistik (instansi, posko, atau pihak terkait).</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px", alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Tambah Penerima</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <label>Nama Penerima / PIC</label>
              <input type="text" value={form.nama} onChange={(e) => set("nama", e.target.value)} required />
            </div>
            <div>
              <label>Kontak (No HP / Telp)</label>
              <input type="text" value={form.kontak} onChange={(e) => set("kontak", e.target.value)} required />
            </div>
            <div>
              <label>Instansi / Posko / Alamat</label>
              <textarea value={form.instansi} onChange={(e) => set("instansi", e.target.value)} required rows={3}></textarea>
            </div>
            <button type="submit" className="primary" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Menyimpan..." : "Simpan Penerima"}
            </button>
          </form>
        </div>

        <DataTable data={receivers} columns={columns} onDelete={handleDelete} title="Daftar Penerima" searchKey="nama" />
      </div>
    </div>
  );
}
