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
import StatusSelect from "./cells/StatusSelect";
import TaskCell from "./cells/TaskCell";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  timersComplete: number;
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => {
      return <TaskCell task={row.original} />;
    },
  },
  {
    accessorKey: "timeToComplete",
    header: "Est. Hours",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          {row.original.timersComplete}/{row.getValue("timeToComplete")}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original;

      return <StatusSelect task={status} />;
    },
  },
  {
    accessorKey: "actions",
    header: "",
  },
];
