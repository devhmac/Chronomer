"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Divide, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "task",
    header: "Task",
  },
  {
    accessorKey: "timeToComplete",
    header: "Est. Hours",
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("timeToComplete")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original;

      return (
        <Select>
          <SelectTrigger className="mr-1 border-none">
            <SelectValue placeholder={status.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">In Progress</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
];
