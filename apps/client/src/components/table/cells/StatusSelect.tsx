import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/lib/types/types";

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
  const statusOptions = Object.keys(statusMap);
  const initialStatus =
    task && task.status ? statusMap[task.status] : "Backlog";

  return (
    <Select value={task.status}>
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={initialStatus} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status: string) => {
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
