import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusSelect = ({ task }) => {
  return (
    <Select>
      <SelectTrigger className="mr-1 border-none">
        <SelectValue placeholder={task.status} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">In Progress</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelect;
