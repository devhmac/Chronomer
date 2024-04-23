"use client";
import { taskContext } from "@/providers/TaskContext";
import React, { useContext } from "react";

import { Task } from "@/lib/utils/constructors";

const NewTask = () => {
  const { addTask } = useContext(taskContext);

  return (
    <div className="h-full w-full rounded-sm border border-dashed border-input p-2 text-muted-foreground hover:cursor-pointer hover:text-zinc-200 ">
      <p
        onClick={() => {
          const createdTask: Task = new Task();

          addTask(createdTask);
          console.log(createdTask);
        }}
        className="text-center  "
      >
        Add New Task
      </p>
    </div>
  );
};

export default NewTask;
