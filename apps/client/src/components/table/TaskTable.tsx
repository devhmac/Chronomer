"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function TaskTable({
  data,
  tableLoading,
}: {
  data: Task[];
  tableLoading: boolean;
}) {
  return (
    // <div className="@container">
    <Table className="rounded-md border bg-popover backdrop-blur-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[50px] sm:table-cell">
            <span className="sr-only">Complete Task</span>
          </TableHead>
          <TableHead>Task</TableHead>
          {/* <TableHead>tag</TableHead> */}
          <TableHead className="hidden md:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell">Time</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableLoading ? (
          <TableSkeleton />
        ) : (
          data.map((task, index) => {
            return (
              <TableRow
                key={`${task.id}${index}`}
                className={
                  task.isComplete
                    ? "bg-background-muted text-str text-zinc-500 line-through	"
                    : ""
                }
              >
                <TableCell className="hidden sm:table-cell">
                  <div className="">
                    {task.id === "-1" ? (
                      <CancelTask task={task} />
                    ) : (
                      <CompleteTask task={task} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="min-w-[315px]  @[560px]:bg-red-400">
                  <TaskCell task={task} />
                </TableCell>
                {/* <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell> */}
                <TableCell className="hidden md:table-cell">
                  <StatusSelect task={task} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {task.timersComplete}/{task.timeToComplete}
                </TableCell>

                <TableCell>
                  <Options task={task} />
                </TableCell>
              </TableRow>
            );
          })
        )}
        <TableRow>
          <TableCell className="px-1 " colSpan={5}>
            <NewTask />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    // </div>
  );
}