"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData,TValue> {
    columns: ColumnDef<TData,TValue>[],
    data: TData[]
};

export function DataTable<TData,TValue> ({
    columns,
    data
}: DataTableProps<TData,TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-emerald-950">
            <Table>
                <TableHeader>
                              {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header,index) => {
                return (
                  <TableHead key={index}
                   className="text-gray-400 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
                </TableHeader>
                <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row,index) => (
              <TableRow
                key={index}
                className="hover:bg-zinc-900 transition"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell,index) => (
                  <TableCell key={index}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-zinc-900 transition">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
            </Table>
        </div>
    )
}