import { Task } from "@/lib/types/types";
import React, { Dispatch, SetStateAction } from "react";
import { TableCell, TableRow } from "../ui/table";
import CancelTask from "./cells/CancelTask";
import CompleteTask from "./cells/CompleteTask";
import TaskCell from "./cells/TaskCell";
import StatusSelect from "./cells/StatusSelect";
import TimeSpent from "./cells/TimeSpent";
import Options from "./cells/Options";
import { cn } from "@/lib/utils/utils";

const TaskRow = ({
  task,
  isActive,
  setTaskActive,
}: {
  task: Task;
  isActive: boolean;
  setTaskActive: (taskId: Task["id"]) => void;
}) => {
  return (
    <TableRow
      // key={`${task.id}${index}`}
      className={cn(
        "relative",
        task.isComplete
          ? "bg-background-muted text-str text-zinc-500 line-through	"
          : "",
      )}
      onClick={() => setTaskActive(task.id)}
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
      <TableCell className="min-w-[315px] @[560px]:bg-red-400  md:max-w-[315px]">
        <TaskCell task={task} />
      </TableCell>
      {/* <TableCell>
<Badge variant="outline">Draft</Badge>
</TableCell> */}
      <TableCell className="hidden md:table-cell">
        <StatusSelect task={task} />
      </TableCell>
      <TableCell className="hidden text-center md:table-cell">
        <TimeSpent
          timeToComplete={task.timeToComplete}
          timersComplete={task.timeSpent}
          taskId={task.id}
        />
      </TableCell>

      <TableCell>
        <Options task={task} />
        {isActive ? (
          <span className=" absolute inset-y-0 right-0 z-10 my-auto h-full w-1 bg-[#7dd3fc] "></span>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
