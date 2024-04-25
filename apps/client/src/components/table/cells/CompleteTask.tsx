import { cn } from "@/lib/utils/utils";
import { CircleCheckBig } from "lucide-react";
import React, { useContext } from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";

const CompleteTask = ({ task }: { task: Task }) => {
  const { deleteTask } = useContext(taskContext);
  const isComplete = false;
  return (
    <div className=" hover:cursor-pointer">
      <CircleCheckBig
        onClick={() => deleteTask(task)}
        className={cn(
          "h-4 w-4 text-zinc-400 ",
          isComplete ? "text-green-400" : "text-zinc-400 hover:text-zinc-200",
        )}
      />
    </div>
  );
};

export default CompleteTask;
