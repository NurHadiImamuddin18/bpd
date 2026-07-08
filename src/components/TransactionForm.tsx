"use client";

import { useState } from "react";
import { db, collection, addDoc, doc, updateDoc, increment } from "@/lib/firebase";
import { useAppData } from "@/context/DataProvider";
import { MasterItem } from "@/types";

interface TransactionFormProps {
  tipe: "masuk" | "keluar" | "rusak";
}

export default function TransactionForm({ tipe }: TransactionFormProps) {
  const { items, receivers } = useAppData();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterItem | null>(null);

  const [form, setForm] = useState({
    itemId: "",
    jumlah: "",
    pelaku: "",
    penerima: "",
    keterangan: "",
    tanggal: new Date().toISOString().slice(0, 16),
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleItemSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    set("itemId", id);
    setSelectedItem(items.find((i) => i.id === id) || null);
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const getActionName = () => {
    if (tipe === "masuk") return "Penerimaan";
    if (tipe === "keluar") return "Distribusi";
    return "Laporan Rusak";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return alert("Pilih logistik terlebih dahulu!");
    setLoading(true);

    try {
      const qty = Number(form.jumlah);
      if ((tipe === "keluar" || tipe === "rusak") && selectedItem.stokTersedia < qty) {
        alert("Stok fisik tidak mencukupi!");
        setLoading(false);
        return;
      }

      const total = selectedItem.hargaSatuan * qty;

      const payload: any = {
        kodeBarang: selectedItem.kodeBarang,
        namaBarang: selectedItem.namaBarang,
        tipe,
        jumlah: qty,
        hargaSatuan: selectedItem.hargaSatuan,
        total,
        tanggal: new Date(form.tanggal).toISOString(),
        createdAt: new Date().toISOString(),
      };

      if (tipe !== "rusak") {
        payload.pelaku = form.pelaku;
        payload.penerima = form.penerima;
      }
      if (form.keterangan) {
        payload.keterangan = form.keterangan;
      }

      await addDoc(collection(db, "transactions"), payload);

      setForm({ itemId: "", jumlah: "", pelaku: "", penerima: "", keterangan: "", tanggal: new Date().toISOString().slice(0, 16) });
      setSelectedItem(null);
      alert(`${getActionName()} berhasil dicatat!`);
    } catch {
      alert("Gagal menyimpan transaksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div>
        <label>Pilih Logistik</label>
        <select required value={form.itemId} onChange={handleItemSelect}>
          <option value="" disabled>-- Pilih berdasarkan Kode --</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              [{item.kodeBarang}] {item.namaBarang} — Sisa: {item.stokTersedia}
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="info-box">
          <strong>{selectedItem.namaBarang}</strong><br />
          Kategori: {selectedItem.kategori} · Harga Satuan: {formatRp(selectedItem.hargaSatuan)}
        </div>
      )}

      <div>
        <label>Jumlah</label>
        <input type="number" value={form.jumlah} onChange={(e) => set("jumlah", e.target.value)} required min="1" />
      </div>

      {selectedItem && form.jumlah && Number(form.jumlah) > 0 && (
        <div style={{ padding: "10px", background: "var(--bg-subtle)", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
          <span style={{ fontWeight: 600 }}>Total Estimasi Nilai:</span>
          <span style={{ fontWeight: 700, color: "var(--fg-dark)" }}>{formatRp(selectedItem.hargaSatuan * Number(form.jumlah))}</span>
        </div>
      )}

      {tipe !== "rusak" && (
        <>
          <div>
            <label>{tipe === "masuk" ? "Sumber (BNPB, APBD, Donatur)" : "Tujuan Distribusi"}</label>
            <input
              type="text"
              value={form.pelaku}
              onChange={(e) => set("pelaku", e.target.value)}
              required
              placeholder={tipe === "masuk" ? "Contoh: Bantuan BNPB Pusat" : "Contoh: Posko Desa A"}
            />
          </div>

          <div>
            <label>Penerima</label>
            <select required value={form.penerima} onChange={(e) => set("penerima", e.target.value)}>
              <option value="" disabled>-- Pilih Penerima --</option>
              {receivers.map((r) => (
                <option key={r.id} value={r.nama}>{r.nama} ({r.instansi})</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label>Keterangan</label>
        <textarea 
          value={form.keterangan} 
          onChange={(e) => set("keterangan", e.target.value)} 
          placeholder="Catatan tambahan (opsional)" 
          rows={2}
          required={tipe === "rusak"}
        ></textarea>
      </div>

      <div>
        <label>Tanggal & Waktu</label>
        <input type="datetime-local" value={form.tanggal} onChange={(e) => set("tanggal", e.target.value)} required />
      </div>

      <button type="submit" className="primary" disabled={loading} style={{ marginTop: "4px" }}>
        {loading ? "Menyimpan..." : `Catat ${getActionName()}`}
      </button>
    </form>
  );
}
