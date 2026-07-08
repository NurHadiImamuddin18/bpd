"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { db, collection, query, orderBy, onSnapshot } from "@/lib/firebase";
import { MasterItem, UserItem, TransactionItem, ReceiverItem } from "@/types";

interface AppData {
  items: MasterItem[];
  users: UserItem[];
  transactions: TransactionItem[];
  receivers: ReceiverItem[];
  ready: boolean;
}

const DataContext = createContext<AppData>({
  items: [],
  users: [],
  transactions: [],
  receivers: [],
  ready: false,
});

export function useAppData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [receivers, setReceivers] = useState<ReceiverItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const markLoaded = () => {
      loadedCount++;
      if (loadedCount >= 4) setReady(true);
    };

    const unsubItems = onSnapshot(
      query(collection(db, "items"), orderBy("createdAt", "desc")),
      (snap) => {
        const data: MasterItem[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as MasterItem));
        setItems(data);
        markLoaded();
      }
    );

    const unsubUsers = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc")),
      (snap) => {
        const data: UserItem[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as UserItem));
        setUsers(data);
        markLoaded();
      }
    );

    const unsubTrans = onSnapshot(
      query(collection(db, "transactions"), orderBy("tanggal", "desc")),
      (snap) => {
        const data: TransactionItem[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as TransactionItem));
        setTransactions(data);
        markLoaded();
      }
    );

    const unsubReceivers = onSnapshot(
      query(collection(db, "receivers"), orderBy("createdAt", "desc")),
      (snap) => {
        const data: ReceiverItem[] = [];
        snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as ReceiverItem));
        setReceivers(data);
        markLoaded();
      }
    );

    return () => {
      unsubItems();
      unsubUsers();
      unsubTrans();
      unsubReceivers();
    };
  }, []);

  const itemsWithStock = React.useMemo(() => {
    return items.map((item) => {
      const itemTrans = transactions.filter((t) => t.kodeBarang === item.kodeBarang);
      const masuk = itemTrans.filter((t) => t.tipe === "masuk").reduce((a, t) => a + t.jumlah, 0);
      const keluar = itemTrans.filter((t) => t.tipe === "keluar").reduce((a, t) => a + t.jumlah, 0);
      const rusak = itemTrans.filter((t) => t.tipe === "rusak").reduce((a, t) => a + t.jumlah, 0);
      
      return {
        ...item,
        stokTersedia: masuk - keluar - rusak,
      };
    });
  }, [items, transactions]);

  const value = React.useMemo(() => ({
    items: itemsWithStock,
    users,
    transactions,
    receivers,
    ready
  }), [itemsWithStock, users, transactions, receivers, ready]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
