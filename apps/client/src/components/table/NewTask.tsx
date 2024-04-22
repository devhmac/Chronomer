"use client";
import { taskContext } from "@/providers/TaskContext";
import React, { ReactNode, useContext, useState } from "react";
import { Input } from "../ui/input";
import { Task } from "@/lib/utils/constructors";
import StatusSelect from "./cells/StatusSelect";

const NewTask = () => {
  const { addTask } = useContext(taskContext);

  return (
    <div className="h-full w-full rounded-sm border border-dashed border-input p-2 text-muted-foreground hover:cursor-pointer hover:text-zinc-200 ">
      <p
        onClick={() => {
          const createdTask = new Task();

          addTask(createdTask);
        }}
        className="text-center  "
      >
        Add New Task
      </p>
    </div>
  );
};

export default NewTask;
