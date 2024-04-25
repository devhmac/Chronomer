import { cn } from "@/lib/utils/utils";
import { CircleOff } from "lucide-react";
import { Task } from "@/lib/types/types";
import React, { useContext } from "react";
import { taskContext } from "@/providers/TaskContext";

const CancelTask = ({ task }: { task: Task }) => {
  const { deleteTask } = useContext(taskContext);
  return (
    <div className=" hover:cursor-pointer" aria-label="Cancel Task Creation">
      <CircleOff
        onClick={() => {
          deleteTask(task);
        }}
        className={cn("h-4 w-4 text-rose-400 hover:text-rose-600")}
      />
    </div>
  );
};

export default CancelTask;
