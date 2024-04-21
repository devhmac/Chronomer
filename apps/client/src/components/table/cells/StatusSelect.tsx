import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap = {
  BACKLOG: "Backlog",
  INPROGRESS: "In Progress",
  COMPLETE: "Complete",
  BLOCKED: "Blocked",
} as {
  COMPLETE: string;
  INPROGRESS: string;
  BACKLOG: string;
  BLOCKED: string;
};

type props = {
  task?: any; //make this the task type
};

const StatusSelect = ({ task }: props) => {
  const statusOptions = Object.keys(statusMap);
  const initialStatus =
    task && task.status ? statusMap[task.status] : "Set Status";

  return (
    <Select>
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={initialStatus} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          return (
            <SelectItem key={status} value={status}>
              {statusMap[status]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
