"use client";

import { useState } from "react";
import { db, collection, addDoc, deleteDoc, doc } from "@/lib/firebase";
import { useAppData } from "@/context/DataProvider";
import { MasterItem } from "@/types";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { PackagePlus } from "lucide-react";

export default function MasterBarangPage() {
  const { items } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    kodeBarang: "",
    namaBarang: "",
    kategori: "",
    hargaSatuan: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "items"), {
        kodeBarang: form.kodeBarang,
        namaBarang: form.namaBarang,
        kategori: form.kategori,
        hargaSatuan: Number(form.hargaSatuan),
        stokTersedia: 0,
        createdAt: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setForm({ kodeBarang: "", namaBarang: "", kategori: "", hargaSatuan: "" });
    } catch {
      alert("Gagal menambah data logistik.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data logistik ini?")) {
      await deleteDoc(doc(db, "items", id));
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const columns = [
    { header: "Kode", accessorKey: "kodeBarang" as keyof MasterItem },
    {
      header: "Nama Logistik",
      accessorKey: "namaBarang" as keyof MasterItem,
      cell: (item: MasterItem) => <span style={{ fontWeight: 600 }}>{item.namaBarang}</span>,
    },
    { header: "Kategori", accessorKey: "kategori" as keyof MasterItem },
    {
      header: "Harga Satuan",
      accessorKey: "hargaSatuan" as keyof MasterItem,
      cell: (item: MasterItem) => formatRp(item.hargaSatuan),
    },
    {
      header: "Stok Gudang",
      accessorKey: "stokTersedia" as keyof MasterItem,
      cell: (item: MasterItem) => <span className="badge neutral">{item.stokTersedia}</span>,
    },
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title">Data Logistik</h1>
          <p className="page-subtitle">Kelola database bantuan, harga perolehan, dan stok gudang BPBD.</p>
        </div>
        <button className="primary" onClick={() => setIsModalOpen(true)}>
          <PackagePlus size={15} /> Tambah Logistik
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Logistik">
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>Kode Logistik</label>
            <input required value={form.kodeBarang} onChange={(e) => set("kodeBarang", e.target.value)} placeholder="Contoh: LOG-001" />
          </div>
          <div>
            <label>Nama Bantuan / Logistik</label>
            <input required value={form.namaBarang} onChange={(e) => set("namaBarang", e.target.value)} placeholder="Contoh: Beras 5Kg" />
          </div>
          <div>
            <label>Kategori</label>
            <input required value={form.kategori} onChange={(e) => set("kategori", e.target.value)} placeholder="Contoh: Pangan" />
          </div>
          <div>
            <label>Harga Satuan / Perolehan (Rp)</label>
            <input type="number" required value={form.hargaSatuan} onChange={(e) => set("hargaSatuan", e.target.value)} min="0" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="primary">Simpan</button>
          </div>
        </form>
      </Modal>

      <DataTable data={items} columns={columns} onDelete={handleDelete} title="Daftar Logistik & Bantuan" searchKey="namaBarang" />
    </div>
  );
}
