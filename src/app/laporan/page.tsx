"use client";

import { useAppData } from "@/context/DataProvider";
import { deleteDoc, doc, db } from "@/lib/firebase";
import { TransactionItem } from "@/types";
import DataTable from "@/components/DataTable";

export default function LaporanPage() {
  const { transactions } = useAppData();

  const handleDelete = async (id: string) => {
    if (confirm("Hapus catatan ini?")) {
      await deleteDoc(doc(db, "transactions", id));
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const columns = [
    {
      header: "Arah",
      accessorKey: "tipe" as keyof TransactionItem,
      cell: (item: TransactionItem) => (
        <span className={`badge ${item.tipe === "masuk" ? "success" : "danger"}`}>
          {item.tipe === "masuk" ? "IN" : "OUT"}
        </span>
      ),
    },
    { header: "Kode", accessorKey: "kodeBarang" as keyof TransactionItem },
    {
      header: "Nama Bantuan",
      accessorKey: "namaBarang" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 500 }}>{item.namaBarang}</span>,
    },
    { header: "Sumber / Tujuan", accessorKey: "pelaku" as keyof TransactionItem },
    {
      header: "Harga Satuan",
      accessorKey: "hargaSatuan" as keyof TransactionItem,
      cell: (item: TransactionItem) => formatRp(item.hargaSatuan),
    },
    { header: "Jumlah", accessorKey: "jumlah" as keyof TransactionItem },
    {
      header: "Total Nilai",
      accessorKey: "total" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 600 }}>{formatRp(item.total)}</span>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className="page-title">Laporan</h1>
        <p className="page-subtitle">Riwayat seluruh transaksi logistik BPBD.</p>
      </div>
      <DataTable data={transactions} columns={columns} onDelete={handleDelete} title="Seluruh Catatan Logistik" searchKey="namaBarang" />
    </div>
  );
}
