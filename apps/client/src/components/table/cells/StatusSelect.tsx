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
} as StatusMap;

type props = {
  task: Task; //make this the task type
};

const StatusSelect = ({ task }: props) => {
  const { addTask, updateTask } = useContext(taskContext);
  const statusOptions = Object.keys(statusMap);
  const initialStatus =
    task && task.status ? statusMap[task.status] : "Backlog";
  const [selectedStatus, setSelectedStatus] = useState(
    task.status || "Backlog",
  );

  return (
    <Select
      onValueChange={(val) => {
        console.log(val);
        const updatedTask = { ...task, status: val };
        updateTask(updatedTask);
      }}
      defaultValue={task.status}
    >
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={initialStatus} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          return (
            <SelectItem
              key={status}
              value={status}
              onClick={(e) => {
                console.log(status);
                const updatedTask = { ...task, status: status };
                updateTask(updatedTask);
              }}
            >
              {statusMap[status as keyof StatusMap]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
