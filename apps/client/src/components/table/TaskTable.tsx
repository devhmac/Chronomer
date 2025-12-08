"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/lib/types/types";
import CancelTask from "./cells/CancelTask";
import CompleteTask from "./cells/CompleteTask";
import TaskCell from "./cells/TaskCell";
import StatusSelect from "./cells/StatusSelect";
import Options from "./cells/Options";
import NewTask from "./NewTask";
import TableSkeleton from "./skeleton/TableSkeleton";
import TimeSpent from "./cells/TimeSpent";
import { cn } from "@/lib/utils/utils";
import { Dispatch, SetStateAction, useState } from "react";
import TaskRow from "./TaskRow";

export default function TaskTable({
  data,
  tableLoading,
  setTaskActive,
  activeTaskId,
}: {
  data: Task[];
  tableLoading: boolean;
  setTaskActive: (taskId: Task["id"]) => void;
  activeTaskId: string | undefined;
}) {
  // memoize this into an object of arrays by section?
  const rows = data
    .filter((data) => !data.isComplete)
    .map((task, index) => {
      return (
        <TaskRow
          key={`${task.id}${index}`}
          task={task}
          isActive={task.id === activeTaskId}
          setTaskActive={setTaskActive}
        />
      );
    });

  const completed = data
    .filter((data) => data.isComplete)
    .map((task, index) => {
      return (
        <TaskRow
          key={`${task.id}${index}`}
          task={task}
          isActive={task.id === activeTaskId}
          setTaskActive={setTaskActive}
        />
      );
    });

  return (
    // <div className="@container">
    <>
      <Table className="rounded-md border bg-popover backdrop-blur-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] ">
              <span className="sr-only">Complete Task</span>
            </TableHead>
            <TableHead>Task</TableHead>
            {/* <TableHead>tag</TableHead> */}
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="">Time</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableLoading ? <TableSkeleton /> : rows}
          <TableRow>
            <TableCell className="px-1 " colSpan={5}>
              <NewTask />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {completed.length > 0 && (
        <>
          <h3 className="mb-2 ml-2 mt-4">Complete</h3>
          <Table className="rounded-md border bg-popover backdrop-blur-xs">
            <TableBody>{completed}</TableBody>
          </Table>
        </>
      )}
    </>
    // </div>
  );
}
