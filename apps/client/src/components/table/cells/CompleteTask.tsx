import { cn } from "@/lib/utils/utils";
import { CircleCheckBig, Circle } from "lucide-react";
import React, { useContext, useState } from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";

const CompleteTask = ({ task }: { task: Task }) => {
  const { updateTask } = useContext(taskContext);
  const [taskComplete, setTaskComplete] = useState(task.isComplete);
  const isComplete = task.isComplete;
  return (
    <div className=" hover:cursor-pointer">
      <CircleCheckBig
        onClick={() => {
          isComplete;
          // console.log("task being delete", task);
          const updatedTask = {
            ...task,
            isComplete: !isComplete,
          };
          updatedTask.completedAt = !isComplete ? new Date() : null;
          updateTask(updatedTask);
          // optimistic update
          setTaskComplete((prev) => !prev);
        }}
        className={cn(
          "h-4 w-4 text-zinc-400 ",
          taskComplete
            ? "text-green-400"
            : "text-zinc-400 hover:text-accent-foreground",
        )}
      />
    </div>
  );
};

export default CompleteTask;
