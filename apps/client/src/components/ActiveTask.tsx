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

const ActiveTask = () => {
  const { activeTask } = useContext(taskContext);
  console.log("active Task in component", activeTask);

  return !activeTask ? (
    <div>no active task selected</div>
  ) : (
    <Table className="max-w-full">
      <TableBody>
        <TableRow
          key={activeTask.id}
          className={
            activeTask.isComplete
              ? "bg-background-muted text-str text-zinc-500 line-through	"
              : ""
          }
        >
          <TableCell className="hidden sm:table-cell">
            <div className="">
              {activeTask.id === "-1" ? (
                <CancelTask task={activeTask} />
              ) : (
                <CompleteTask task={activeTask} />
              )}
            </div>
          </TableCell>
          <TableCell className="min-w-[315px] @[560px]:bg-red-400  md:max-w-[315px]">
            <TaskCell task={activeTask} />
          </TableCell>
          {/* <TableCell>
                <Badge variant="outline">Draft</Badge>
              </TableCell> */}
          <TableCell className="hidden md:table-cell">
            <StatusSelect task={activeTask} />
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {activeTask.timersComplete}/{activeTask.timeToComplete}
          </TableCell>

          <TableCell>
            <Options task={activeTask} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ActiveTask;
