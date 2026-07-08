"use client";

import { useState } from "react";
import { db, collection, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { useAppData } from "@/context/DataProvider";
import { UserItem } from "@/types";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { UserPlus } from "lucide-react";

export default function UsersPage() {
  const { users } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "", role: "Staf Logistik" });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), {
        nama: form.nama,
        email: form.email,
        role: form.role,
        createdAt: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setForm({ nama: "", email: "", role: "Staf Logistik" });
    } catch {
      alert("Gagal menambah staf.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data staf ini?")) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  const columns = [
    {
      header: "Nama Lengkap",
      accessorKey: "nama" as keyof UserItem,
      cell: (item: UserItem) => <span style={{ fontWeight: 600 }}>{item.nama}</span>,
    },
    { header: "Kontak / Email", accessorKey: "email" as keyof UserItem },
    {
      header: "Peran",
      accessorKey: "role" as keyof UserItem,
      cell: (item: UserItem) => (
        <span className={`badge ${item.role === "Admin" ? "accent" : "neutral"}`}>
          {item.role}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Kelola daftar staf logistik dan petugas lapangan BPBD.</p>
        </div>
        <button className="primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah User Baru">
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>Nama Lengkap</label>
            <input required value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Nama lengkap user" />
          </div>
          <div>
            <label>Email atau Nomor Kontak</label>
            <input required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email atau HP" />
          </div>
          <div>
            <label>Peran / Jabatan</label>
            <select required value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="primary">Simpan</button>
          </div>
        </form>
      </Modal>

      <DataTable data={users} columns={columns} onDelete={handleDelete} title="Users" searchKey="nama" hideExcel={true} />
    </div>
  );
}
