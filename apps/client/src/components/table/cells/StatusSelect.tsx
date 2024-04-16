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

const StatusSelect = ({ task }) => {
  const statusOptions = Object.keys(statusMap);
  return (
    <Select>
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={task ? statusMap[task.status] : "Backlog"} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => {
          return <SelectItem value={status}>{statusMap[status]}</SelectItem>;
        })}
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
