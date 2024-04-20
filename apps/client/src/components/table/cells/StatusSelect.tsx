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
  return (
    <Select>
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={task ? statusMap[task.status] : "Backlog"} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          return (
            <SelectItem key={statusMap[status]} value={status}>
              {statusMap[status]}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
