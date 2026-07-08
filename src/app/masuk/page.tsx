"use client";

import { useAppData } from "@/context/DataProvider";
import { deleteDoc, doc, db } from "@/lib/firebase";
import TransactionForm from "@/components/TransactionForm";
import DataTable from "@/components/DataTable";
import { TransactionItem } from "@/types";

export default function BarangMasukPage() {
  const { transactions } = useAppData();
  const masuk = transactions.filter((t) => t.tipe === "masuk");

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data penerimaan ini?")) {
      await deleteDoc(doc(db, "transactions", id));
    }
  };

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const columns = [
    { header: "Kode", accessorKey: "kodeBarang" as keyof TransactionItem },
    {
      header: "Logistik",
      accessorKey: "namaBarang" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 600 }}>{item.namaBarang}</span>,
    },
    { header: "Sumber Bantuan", accessorKey: "pelaku" as keyof TransactionItem },
    { header: "Penerima", accessorKey: "penerima" as keyof TransactionItem },
    { header: "Jumlah", accessorKey: "jumlah" as keyof TransactionItem },
    { header: "Keterangan", accessorKey: "keterangan" as keyof TransactionItem },
    {
      header: "Total Nilai",
      accessorKey: "total" as keyof TransactionItem,
      cell: (item: TransactionItem) => <span style={{ fontWeight: 600 }}>{formatRp(item.total)}</span>,
    },
    {
      header: "Tgl Masuk",
      accessorKey: "tanggal" as keyof TransactionItem,
      cell: (item: TransactionItem) => new Date(item.tanggal).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 className="page-title">Barang Masuk</h1>
        <p className="page-subtitle">Catat penerimaan logistik dari BNPB, APBD, atau donatur.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "16px", alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Form Penerimaan</h3>
          <TransactionForm tipe="masuk" />
        </div>
        <DataTable data={masuk} columns={columns} onDelete={handleDelete} title="Riwayat Penerimaan" searchKey="namaBarang" hideExcel={true} />
      </div>
    </div>
  );
}
