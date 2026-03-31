import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

import type { ColumnDef } from "@tanstack/react-table";

export interface Column<T = any> {
  key: keyof T | string;
  title: string;
  className?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface AdminTableProps<T = any> {
  data: T[] | { rows: T[] };
  columns: Array<Column<T>>;
  keyField: keyof T;
  isLoading?: boolean;
  error?: any;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function AdminTable<T>({
  data,
  columns,
  keyField,
  isLoading = false,
  error,
  emptyMessage = "No data found.",
  className = "",
  onRowClick,
}: AdminTableProps<T>) {
  const columnHelper = createColumnHelper<T>();

  const tableColumns: Array<ColumnDef<T, any>> = columns.map((col) => {
    const accessorKey = col.key as keyof T;
    return columnHelper.accessor((row) => row[accessorKey], {
      id: col.key as string,
      header: col.title,
      cell: ({ getValue, row }) =>
        col.render ? col.render(getValue(), row.original) : String(getValue()),
      meta: { className: col.className },
    });
  });

  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "rows" in data
      ? data.rows
      : [];

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getRowId: (row) => String(row[keyField]),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      className={`border rounded-lg flex flex-col h-full min-h-0 ${className}`}
    >
      <div className="flex-1 overflow-auto w-full no-scrollbar">
        <table className="min-w-full table-auto text-sm md:text-base border-0">
          <thead className="bg-common-bg text-heading-color sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-2 font-medium text-foreground ${
                      header.column.id === "actions"
                        ? "text-center px-0"
                        : "text-left px-2 md:px-4"
                    } ${header.column.columnDef.meta?.className || ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {!isLoading && error && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-destructive"
                >
                  {error?.message || "An error occurred"}
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t hover:bg-muted/50 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`py-1 md:py-2 text-text-color ${
                        cell.column.id === "actions"
                          ? "px-0 text-center"
                          : "px-2 md:px-4"
                      } ${cell.column.columnDef.meta?.className || ""}`}
                      onClick={() => {
                        if (onRowClick && cell.column.id !== "actions") {
                          onRowClick(row.original);
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && !error && rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-text-color"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
