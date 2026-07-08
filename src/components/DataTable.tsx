"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Download, Trash2, Edit, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onDelete?: (id: string) => void;
  onEdit?: (item: T) => void;
  title?: string;
  searchKey?: keyof T;
  hideExcel?: boolean;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onDelete,
  onEdit,
  title = "Data",
  searchKey,
  hideExcel = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = data.filter((item) => {
    if (!search || !searchKey) return true;
    const val = item[searchKey];
    return typeof val === "string" && val.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);

  const exportExcel = () => {
    const rows = data.map((item, i) => {
      const row: Record<string, unknown> = { No: i + 1 };
      columns.forEach((col) => {
        if (col.accessorKey) {
          let val = item[col.accessorKey];
          if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}T/)) {
            try { val = format(new Date(val as string), "dd/MM/yyyy HH:mm") as typeof val; } catch {}
          }
          row[col.header] = val;
        }
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd")}.xlsx`);
  };

  return (
    <div className="table-wrapper">
      <div className="table-toolbar">
        <h3>{title}</h3>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {searchKey && (
            <div className="table-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          )}
          {!hideExcel && (
            <button onClick={exportExcel} style={{ height: "34px", fontSize: "12px" }}>
              <Download size={14} /> Excel
            </button>
          )}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
              {(onDelete || onEdit) && <th style={{ textAlign: "right" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="table-empty">
                  Belum ada data.
                </td>
              </tr>
            ) : (
              visible.map((item, i) => (
                <tr key={item.id}>
                  <td style={{ color: "var(--fg-muted)" }}>{start + i + 1}</td>
                  {columns.map((col, ci) => (
                    <td key={ci}>
                      {col.cell
                        ? col.cell(item, start + i)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                  {(onDelete || onEdit) && (
                    <td>
                      <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                        {onEdit && (
                          <button className="action-btn" onClick={() => onEdit(item)} title="Edit">
                            <Edit size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button className="action-btn delete" onClick={() => onDelete(item.id)} title="Hapus">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <span>
            {start + 1}–{Math.min(start + perPage, filtered.length)} dari {filtered.length}
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              className="ghost"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{ padding: "4px 8px" }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              className="ghost"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{ padding: "4px 8px" }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
