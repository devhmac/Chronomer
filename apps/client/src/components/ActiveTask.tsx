"use client";
import { Task } from "@/lib/types/types";
import CancelTask from "./table/cells/CancelTask";

import TaskCell from "./table/cells/TaskCell";
import StatusSelect from "./table/cells/StatusSelect";
import Options from "./table/cells/Options";
import CompleteTask from "./table/cells/CompleteTask";
import { useContext, useState } from "react";
import { taskContext } from "@/providers/TaskContext";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils/utils";

const ActiveTask = () => {
  const { activeTask, clearActiveTask } = useContext(taskContext);

  return (
    <div className="glass-bg mb-2  gap-4 overflow-hidden rounded-md p-3">
      {activeTask ? (
        <div
          className={cn(
            "flex w-full flex-row items-center justify-between gap-4 align-middle",
            activeTask.isComplete
              ? "bg-background-muted text-str text-zinc-500 line-through	"
              : "",
          )}
        >
          <div className="flex flex-row items-center gap-6 align-middle">
            <CompleteTask task={activeTask} />
            <p className="line-clamp-2  text-wrap text-sm">{activeTask.task}</p>
          </div>

          <Eraser
            className="cursor:pointer mr-1 h-4 min-w-4 text-end text-zinc-400  hover:cursor-pointer hover:text-accent-foreground"
            onClick={() => {
              clearActiveTask();
            }}
          />

          <div className="absolute right-0 h-full w-1  bg-[#7dd3fc] "></div>
        </div>
      ) : (
        <p className="w-full text-center">No Active Task Selected...</p>
      )}
    </div>
  );
  // <Table className="glass-bg mb-2 max-w-full rounded-sm">
  //   <TableBody>
  //     <TableRow
  //       key={activeTask.id}
  //       className={
  //         activeTask.isComplete
  //           ? "bg-background-muted text-str rounded-lg border-red-400 text-zinc-500 line-through	"
  //           : ""
  //       }
  //     >
  //       <TableCell className="hidden sm:table-cell">
  //         <div className="">
  //           {activeTask.id === "-1" ? (
  //             <CancelTask task={activeTask} />
  //           ) : (
  //             <CompleteTask task={activeTask} />
  //           )}
  //         </div>
  //       </TableCell>
  //       <TableCell className="min-w-[315px] @[560px]:bg-red-400  md:max-w-[315px]">
  //         <TaskCell task={activeTask} />
  //       </TableCell>
  //       {/* <TableCell>
  //             <Badge variant="outline">Draft</Badge>
  //           </TableCell> */}
  //       <TableCell className="hidden md:table-cell">
  //         <StatusSelect task={activeTask} />
  //       </TableCell>
  //       <TableCell className="hidden md:table-cell">
  //         {activeTask.timersComplete}/{activeTask.timeToComplete}
  //       </TableCell>

  //       <TableCell>
  //         <Options task={activeTask} />
  //       </TableCell>
  //     </TableRow>
  //   </TableBody>
  // </Table>
};

export default ActiveTask;
