"use client";

import { useState, useMemo } from "react";
import { db, collection, addDoc, updateDoc, deleteDoc, doc } from "@/lib/firebase";
import { useAppData } from "@/context/DataProvider";
import { MasterItem } from "@/types";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { PackagePlus, Check } from "lucide-react";

export default function MasterBarangPage() {
  const { items } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    namaBarang: "",
    kategori: "",
    hargaSatuan: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "";
    set(key, formatted);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ namaBarang: "", kategori: "", hargaSatuan: "" });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: MasterItem) => {
    setEditingId(item.id);
    setForm({
      namaBarang: item.namaBarang,
      kategori: item.kategori,
      hargaSatuan: item.hargaSatuan ? new Intl.NumberFormat("id-ID").format(item.hargaSatuan) : "",
    });
    setSuccessMsg("");
    setIsModalOpen(true);
  };

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
      const parsedHarga = Number(form.hargaSatuan.replace(/\./g, ""));
      
      if (editingId) {
        await updateDoc(doc(db, "items", editingId), {
          namaBarang: form.namaBarang,
          kategori: form.kategori,
          hargaSatuan: parsedHarga,
        });
      } else {
        await addDoc(collection(db, "items"), {
          kodeBarang: nextKode,
          namaBarang: form.namaBarang,
          kategori: form.kategori,
          hargaSatuan: parsedHarga,
          stokTersedia: 0,
          createdAt: new Date().toISOString(),
        });
      }
      setSuccessMsg("Data berhasil ditambahkan atau diperbarui.");
      setTimeout(() => {
        setIsModalOpen(false);
        setForm({ namaBarang: "", kategori: "", hargaSatuan: "" });
        setEditingId(null);
        setSuccessMsg("");
      }, 1500);
    } catch {
      alert("Gagal menyimpan data barang.");
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
        <button className="primary" onClick={openAddModal}>
          <PackagePlus size={15} /> Tambah Barang
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Data Barang" : "Tambah Data Barang"}>
        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ background: "#22c55e", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
              <Check size={16} color="white" strokeWidth={3} />
            </div>
            <div style={{ textAlign: "left" }}>
              <h4 style={{ margin: 0, color: "#111", fontSize: "14px", fontWeight: 700 }}>Success Message</h4>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>{successMsg}</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="form-grid">
          {!editingId && (
            <div>
              <label>Kode Barang</label>
              <input disabled value={nextKode} style={{ background: "var(--bg)", color: "var(--fg-muted)", cursor: "not-allowed" }} />
            </div>
          )}
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
            <input type="text" required value={form.hargaSatuan} onChange={(e) => handleNumberChange(e, "hargaSatuan")} placeholder="600.000" />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
            <button type="submit" className="primary">Simpan</button>
          </div>
        </form>
      </Modal>

      <DataTable data={items} columns={columns} onDelete={handleDelete} onEdit={openEditModal} title="Daftar Barang & Bantuan" searchKey="namaBarang" />
    </div>
  );
}
