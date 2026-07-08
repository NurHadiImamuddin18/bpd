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
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: "", username: "", password: "", role: "User" });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const openAddModal = () => {
    setEditingId(null);
    setForm({ nama: "", username: "", password: "", role: "User" });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: UserItem) => {
    setEditingId(item.id);
    setForm({ nama: item.nama, username: item.username, password: item.password, role: item.role });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanUsername = form.username.trim();
      if (editingId) {
        const { updateDoc, doc, db } = await import("@/lib/firebase");
        await updateDoc(doc(db, "users", editingId), {
          nama: form.nama,
          username: cleanUsername,
          password: form.password,
          role: form.role,
        });
      } else {
        await addDoc(collection(db, "users"), {
          nama: form.nama,
          username: cleanUsername,
          password: form.password,
          role: form.role,
          createdAt: new Date().toISOString(),
        });
      }
      setSuccessMsg("Data berhasil tersimpan");
      setTimeout(() => {
        setIsModalOpen(false);
        setForm({ nama: "", username: "", password: "", role: "User" });
        setEditingId(null);
        setSuccessMsg("");
      }, 1000); // Reduced to 1s for snappier feel
    } catch {
      alert("Gagal menyimpan staf.");
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
    { header: "Username", accessorKey: "username" as keyof UserItem },
    { 
      header: "Password", 
      accessorKey: "password" as keyof UserItem,
      cell: (item: UserItem) => <span style={{ fontFamily: "monospace", letterSpacing: "2px", color: "var(--fg-muted)" }}>••••••••</span>,
    },
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
        <button className="primary" onClick={openAddModal}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit User" : "Tambah User Baru"}>
        {successMsg && (
          <div style={{ background: "#dcfce3", color: "#166534", padding: "12px", borderRadius: "8px", marginBottom: "16px", textAlign: "center", fontSize: "14px", fontWeight: 600 }}>
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>Nama Lengkap</label>
            <input required value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Nama lengkap user" />
          </div>
          <div>
            <label>Username</label>
            <input required value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="Username unik" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" />
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

      <DataTable data={users} columns={columns} onDelete={handleDelete} onEdit={openEditModal} title="Users" searchKey="nama" hideExcel={true} />
    </div>
  );
}
