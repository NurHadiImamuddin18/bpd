"use client";

import { useState, useMemo } from "react";
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
    namaBarang: "",
    kategori: "",
    hargaSatuan: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  // Auto-generate kode barang: cari nomor terbesar yang sudah ada, lalu +1
  const nextKode = useMemo(() => {
    let maxNum = 0;
    items.forEach((item) => {
      const match = item.kodeBarang?.match(/BPBDPROB-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `BPBDPROB-${String(maxNum + 1).padStart(3, "0")}`;
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "items"), {
        kodeBarang: nextKode,
        namaBarang: form.namaBarang,
        kategori: form.kategori,
        hargaSatuan: Number(form.hargaSatuan),
        stokTersedia: 0,
        createdAt: new Date().toISOString(),
      });
    } catch {
      alert("Gagal menambah data barang.");
    } finally {
      setIsModalOpen(false);
      setForm({ namaBarang: "", kategori: "", hargaSatuan: "" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data barang ini?")) {
      await deleteDoc(doc(db, "items", id));
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const columns = [
    { header: "Kode", accessorKey: "kodeBarang" as keyof MasterItem },
    {
      header: "Nama Barang",
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
          <h1 className="page-title">Data Barang</h1>
          <p className="page-subtitle">Kelola database bantuan, harga perolehan, dan stok gudang BPBD.</p>
        </div>
        <button className="primary" onClick={() => setIsModalOpen(true)}>
          <PackagePlus size={15} /> Tambah Barang
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Barang">
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label>Kode Barang</label>
            <input disabled value={nextKode} style={{ background: "var(--bg)", color: "var(--fg-muted)", cursor: "not-allowed" }} />
          </div>
          <div>
            <label>Nama Barang</label>
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

      <DataTable data={items} columns={columns} onDelete={handleDelete} title="Daftar Barang & Bantuan" searchKey="namaBarang" />
    </div>
  );
}
