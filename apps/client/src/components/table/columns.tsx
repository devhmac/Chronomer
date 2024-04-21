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
      const existingTask = row ? row.original : null;

      return <TaskCell task={existingTask} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row ? row.original : undefined;

      return <StatusSelect task={status} />;
    },
  },
  {
    accessorKey: "timeToComplete",
    header: "Est. Hours",
    cell: ({ row }) => {
      return row ? (
        <div className="text-right">
          {row.original.timersComplete}/{row.getValue("timeToComplete")}
        </div>
      ) : (
        <div>No time defined</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
  },
];
