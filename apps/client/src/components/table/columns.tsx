"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StatusSelect from "./cells/StatusSelect";
import TaskCell from "./cells/TaskCell";
import CompleteTask from "./cells/CompleteTask";
import CancelTask from "./cells/CancelTask";
import { Task } from "@/lib/types/types";
import Options from "./cells/Options";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "complete",
    header: "",
    size: 1,
    cell: ({ row }) => {
      return (
        <div className="">
          {row?.original?.id === "-1" ? (
            <CancelTask task={row.original} />
          ) : (
            <CompleteTask task={row.original} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "task",
    header: "Task",
    cell: ({ row }) => {
      // New create task method makes this no longer needed
      // const existingTask = row ? row.original : null;
      {
        console.log(row);
      }
      return <TaskCell task={row.original} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",

    // maxSize: 50,
    cell: ({ row }) => {
      // const status = row ? row.original : undefined;

      return (
        <div className=" max-w-[120px]">
          <StatusSelect task={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "timeToComplete",
    header: "Time",
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
    // size: 5,
    cell: ({ row }) => {
      return (
        <div className="max-w-8">
          <Options task={row.original} />
        </div>
      );
    },
  },
];
