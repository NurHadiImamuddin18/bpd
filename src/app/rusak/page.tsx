"use client";

import { useAppData } from "@/context/DataProvider";
import { deleteDoc, doc, db } from "@/lib/firebase";
import TransactionForm from "@/components/TransactionForm";
import DataTable from "@/components/DataTable";
import { TransactionItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BarangRusakPage() {
  const { transactions, ready } = useAppData();
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === "user") {
      router.push("/masuk");
    }
  }, [role, router]);

  if (!ready || role === "user") return null;

  const rusak = transactions.filter((t) => t.tipe === "rusak");

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data laporan rusak ini?")) {
      await deleteDoc(doc(db, "transactions", id));
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const columns = [
    { header: "Kode", accessorKey: "kodeBarang" as keyof TransactionItem },
    {
      header: "Nama Logistik",
      accessorKey: "namaBarang" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 600 }}>{item.namaBarang}</span>,
    },
    { header: "Jumlah Rusak", accessorKey: "jumlah" as keyof TransactionItem },
    { header: "Keterangan", accessorKey: "keterangan" as keyof TransactionItem },
    {
      header: "Total Kerugian",
      accessorKey: "total" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 600 }}>{formatRp(item.total)}</span>,
    },
    {
      header: "Tgl Lapor",
      accessorKey: "tanggal" as keyof TransactionItem,
      cell: (item: TransactionItem) => new Date(item.tanggal).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className="page-title">Barang Rusak / Tidak Layak</h1>
        <p className="page-subtitle">Catat logistik yang rusak atau kadaluarsa. Ini akan mengurangi stok secara otomatis.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px", alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Form Laporan Rusak</h3>
          <TransactionForm tipe="rusak" />
        </div>
        <DataTable data={rusak} columns={columns} onDelete={handleDelete} title="Riwayat Barang Rusak" searchKey="namaBarang" />
      </div>
    </div>
  );
}
