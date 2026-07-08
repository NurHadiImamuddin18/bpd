"use client";

import { useState } from "react";
import { db, collection, addDoc } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface InventoryFormProps {
  tipe: "masuk" | "keluar";
}

export default function InventoryForm({ tipe }: InventoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    jumlah: "",
    tanggal: new Date().toISOString().slice(0, 16)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "inventory"), {
        nama: formData.nama,
        tipe: tipe,
        harga: Number(formData.harga),
        jumlah: Number(formData.jumlah),
        tanggal: new Date(formData.tanggal).toISOString(),
        createdAt: new Date().toISOString()
      });

      alert(`Data barang ${tipe} berhasil disimpan!`);
      setFormData({
        nama: "",
        harga: "",
        jumlah: "",
        tanggal: new Date().toISOString().slice(0, 16)
      });
      router.push("/");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal menyimpan data. Pastikan konfigurasi Firebase sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nama">Nama Barang</label>
        <input 
          type="text" 
          id="nama" 
          name="nama" 
          value={formData.nama} 
          onChange={handleChange} 
          required 
          placeholder="Misal: Laptop"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="harga">Harga per Barang (Rp)</label>
        <input 
          type="number" 
          id="harga" 
          name="harga" 
          value={formData.harga} 
          onChange={handleChange} 
          required 
          min="0"
          placeholder="Misal: 5000000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="jumlah">Jumlah Barang</label>
        <input 
          type="number" 
          id="jumlah" 
          name="jumlah" 
          value={formData.jumlah} 
          onChange={handleChange} 
          required 
          min="1"
          placeholder="Misal: 10"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tanggal">Tanggal & Waktu</label>
        <input 
          type="datetime-local" 
          id="tanggal" 
          name="tanggal" 
          value={formData.tanggal} 
          onChange={handleChange} 
          required 
        />
      </div>

      <button type="submit" className="primary" disabled={loading} style={{ width: "100%", marginTop: "16px" }}>
        {loading ? "Menyimpan..." : `Simpan Data Barang ${tipe === 'masuk' ? 'Masuk' : 'Keluar'}`}
      </button>
    </form>
  );
}
