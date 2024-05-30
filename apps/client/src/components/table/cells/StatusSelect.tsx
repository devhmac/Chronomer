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
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/utils";

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
  // taskId,
  // statusText,
  task,
  variant,
}: {
  // taskId: string;
  // statusText: string;
  task: Task;
  variant: "row" | "options";
}) => {
  const { updateTask } = useContext(taskContext);

  const statusOptions = Object.keys(statusMap);

  let initialStatus = task && task.status ? task.status : "BACKLOG";

  // let initialStatus;

  // const [complete, setComplete] = useState(task.isComplete);

  if (variant === "row")
    return (
      <Select
        onValueChange={(val) => {
          const updatedTask = { ...task, status: val };
          updateTask(updatedTask);
        }}
        value={task.status}
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
  if (variant === "options")
    return (
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {/* <UserPlus  className="mr-2 h-4 w-4" /> */}
            <span>Status: {statusMap[task.status as keyof StatusMap]}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {statusOptions.map((status) => {
                return (
                  <DropdownMenuItem
                    className={cn(status === task.status ? "bg-accent" : "")}
                    onClick={() => {
                      const updatedTask = { ...task, status: status };
                      updateTask(updatedTask);
                    }}
                  >
                    {statusMap[status as keyof StatusMap]}
                  </DropdownMenuItem>
                  // <SelectItem key={status} value={status}>
                  // </SelectItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    );
};

export default StatusSelect;
