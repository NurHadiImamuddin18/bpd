export type MasterItem = {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  hargaSatuan: number; // BPBD uses per-unit cost
  stokTersedia: number;
  createdAt: string;
};

export type UserItem = {
  id: string;
  nama: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
};

export type TransactionItem = {
  id: string;
  kodeBarang: string;
  namaBarang: string; 
  tipe: "masuk" | "keluar" | "rusak";
  jumlah: number;
  hargaSatuan: number;
  total: number;
  tanggal: string; // ISO string
  pelaku: string; // Sumber (BPBD, BNPB, Donatur) or Tujuan (Pusdalops, Warga, dll)
  penerima?: string;
  keterangan?: string;
  createdAt: string;
};

export type ReceiverItem = {
  id: string;
  nama: string;
  kontak: string;
  instansi: string;
  createdAt: string;
};
