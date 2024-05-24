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
} from "@radix-ui/react-dropdown-menu";
import { MessageSquare } from "lucide-react";

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
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          {/* <UserPlus className="mr-2 h-4 w-4" /> */}
          <span>Invite users</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              {/* <Mail className="mr-2 h-4 w-4" /> */}
              <span>Email</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* <PlusCircle className="mr-2 h-4 w-4" /> */}
              <span>More...</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
};

export default StatusSelect;
