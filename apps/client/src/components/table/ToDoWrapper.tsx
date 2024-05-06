"use client";
import React, { useContext } from "react";

import { taskContext } from "@/providers/TaskContext";
import { ListTodo } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import TaskTable from "./TaskTable";

const ToDoWrapper = ({ className }: { className?: string }) => {
  const { tasks, setTasks, tableLoading } = useContext(taskContext);

  return (
    <div
      className={cn(
        "scrollbar-thumb-green scrollbar-thumb-rounded scrollbar-track-green-lighter scrollbar-w-2 scrolling-touch h-grow h-full overflow-auto rounded-lg border p-3 shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]",
        className,
      )}
    >
      <h2 className="mb-2 text-2xl">
        <ListTodo className="mb-[3px] mr-1 inline h-7 w-7" />
        Tasks
      </h2>
      <div className="w-full">
        <TaskTable data={tasks} tableLoading={tableLoading} />
      </div>
    </div>
  );
};

export default ToDoWrapper;
