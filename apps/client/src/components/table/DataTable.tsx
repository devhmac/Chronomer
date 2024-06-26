"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Dispatch, SetStateAction } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@/components/ui/table";

import NewTask from "./NewTask";
import { Task } from "@/lib/types/types";
import TableSkeleton from "./skeleton/TableSkeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<Task, TValue>[];
  data: Task[];
  setData: Dispatch<SetStateAction<TData[]>>;
  tableLoading: Boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setData,
  tableLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="@container rounded-md border bg-popover backdrop-blur-sm">
      <Table className="">
        <TableHeader className="bg-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="@[500px]:bg-red-200"
                    key={header.id}
                    // className={`w-[${header.getSize()}px]`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {tableLoading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={`${row.id} ${row.original.id}`}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    row.original.isComplete
                      ? "bg-background-muted text-str text-zinc-500 line-through	"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow key="no-results-row">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={columns.length} className=" p-2">
                <NewTask />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}
