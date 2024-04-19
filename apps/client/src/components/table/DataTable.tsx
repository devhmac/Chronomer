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
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import TaskInput from "./TaskInput";
import StatusSelect from "./cells/StatusSelect";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setData: Dispatch<SetStateAction<TData[]>>;
}

export function TodoTable<TData, TValue>({
  columns,
  data,
  setData,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border bg-popover backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}

          {/* Create task footer row */}
          <TableRow>
            {/* {table.getHeaderGroups()[0].headers.map((header) => {
              return header.id === "timeToComplete" ? (
                <TableCell>
                  <p>12 timers</p>
                </TableCell>
              ) : null;
            })} */}
            {table
              .getRowModel()
              .rows[0].getVisibleCells()
              .map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  {console.log(cell.column.columnDef)}
                </TableCell>
              ))}
            {/* <TableCell colSpan={columns.length} className="hover:bg-accent"> */}
            <TableCell className="hover:bg-accent">
              <span className="m-2 h-full w-full border border-dashed border-red-400 text-red-500">
                Test add new row
              </span>
              <TaskInput />
            </TableCell>
            <TableCell key={"10_status"} className="hover:bg-accent">
              {/* {console.log(table.getHeaderGroups()[0])}
              {console.log(table.getRowModel().rows[0].getVisibleCells())} */}

              <StatusSelect />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
