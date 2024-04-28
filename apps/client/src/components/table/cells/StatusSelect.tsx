import React, { useContext, useEffect, useRef, useState } from "react";

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

type props = {
  task: Task; //make this the task type
};

const StatusSelect = ({ task }: props) => {
  console.log("task inside satus", task);
  const { updateTask } = useContext(taskContext);

  const statusOptions = Object.keys(statusMap);

  let initialStatus = task && task.status ? task.status : "BACKLOG";

  // let initialStatus;

  const [status, setStatus] = useState(task.status);
  // const [complete, setComplete] = useState(task.isComplete);

  return (
    <Select
      onValueChange={(val) => {
        console.log(val);
        const updatedTask = { ...task, status: val };
        updateTask(updatedTask);
        setStatus(val);
      }}
      value={status}
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
