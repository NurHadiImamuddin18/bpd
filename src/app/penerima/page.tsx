"use client";

import { useState, useEffect } from "react";
import { useAppData } from "@/context/DataProvider";
import { db, collection, addDoc, updateDoc, deleteDoc, doc } from "@/lib/firebase";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { ReceiverItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function DataPenerimaPage() {
  const { receivers, ready } = useAppData();
  const { role } = useAuth();
  const router = useRouter();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const openAddModal = () => {
    setEditingId(null);
    setForm({ nama: "", kontak: "", instansi: "" });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: ReceiverItem) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      kontak: item.kontak,
      instansi: item.instansi,
    });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "receivers", editingId), {
          ...form,
        });
      } else {
        await addDoc(collection(db, "receivers"), {
          ...form,
          createdAt: new Date().toISOString(),
        });
      }
      
      setSuccessMsg("Data berhasil tersimpan");
      setTimeout(() => {
        setIsModalOpen(false);
        setForm({ nama: "", kontak: "", instansi: "" });
        setEditingId(null);
        setSuccessMsg("");
      }, 1500);
    } catch {
      alert("Gagal menyimpan data penerima.");
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
      <div className="flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">Data Penerima</h1>
          <p className="page-subtitle">Kelola daftar penerima logistik (instansi, posko, atau pihak terkait).</p>
        </div>
        <button className="primary" onClick={openAddModal}>
          <UserPlus size={15} /> Tambah Penerima
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Penerima" : "Tambah Penerima"}>
        {successMsg && (
          <div style={{ background: "#dcfce3", color: "#166534", padding: "12px", borderRadius: "8px", marginBottom: "16px", textAlign: "center", fontSize: "14px", fontWeight: 600 }}>
            {successMsg}
          </div>
        )}
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
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="primary">Simpan</button>
          </div>
        </form>
      </Modal>

      <DataTable data={receivers} columns={columns} onDelete={handleDelete} onEdit={openEditModal} title="Daftar Penerima" searchKey="nama" />
    </div>
  );
}
