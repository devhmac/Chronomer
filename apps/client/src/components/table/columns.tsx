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
import CompleteTask from "./cells/CompleteTask";
import CancelTask from "./cells/CancelTask";
import { Task } from "@/lib/types/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "complete",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="">
          {row?.original?.id === "-1" ? (
            <CancelTask task={row.original} />
          ) : (
            <CompleteTask />
          )}
        </div>
      );
    },
  },
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
  // {
  //   accessorKey: "timeToComplete",
  //   header: "Est. Hours",
  //   cell: ({ row }) => {
  //     return row ? (
  //       <div className="text-right">
  //         {row.original.timersComplete}/{row.getValue("timeToComplete")}
  //       </div>
  //     ) : (
  //       <div>No time defined</div>
  //     );
  //   },
  // },
  {
    accessorKey: "actions",
    header: "",
  },
];
