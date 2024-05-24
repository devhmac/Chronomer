import React, { useContext, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";

type StatusMap = {
  BACKLOG: string;
  INPROGRESS: string;
  COMPLETE: string;
  BLOCKED: string;
};
const statusMap = {
  BACKLOG: "Backlog",
  INPROGRESS: "In Progress",
  COMPLETE: "Complete",
  BLOCKED: "Blocked",
};

const StatusSelect = ({
  taskId,
  statusText,
  task,
}: {
  taskId: string;
  statusText: string;
  task: Task;
}) => {
  const { updateTask } = useContext(taskContext);

  const statusOptions = Object.keys(statusMap);

  let initialStatus = task && task.status ? task.status : "BACKLOG";

  // let initialStatus;

  // const [complete, setComplete] = useState(task.isComplete);

  return (
    <Select
      onValueChange={(val) => {
        const updatedTask = { ...task, status: val };
        updateTask(updatedTask);
      }}
      value={statusText}
    >
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={initialStatus} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          return (
            <SelectItem key={status} value={status}>
              {statusMap[status as keyof StatusMap]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
