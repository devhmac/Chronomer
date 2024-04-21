"use client";
import { taskContext } from "@/providers/TaskContext";
import React, { ReactNode, useContext, useState } from "react";
import { Input } from "../ui/input";
import { Task } from "@/lib/utils/constructors";
import StatusSelect from "./cells/StatusSelect";

const NewTask = () => {
  const { addTask } = useContext(taskContext);

  return (
    <div className="h-full w-full border border-dashed border-input p-2 text-input">
      <p
        onClick={() => {
          const createdTask = new Task();
          console.log(createdTask);
          addTask(createdTask);
        }}
        className="text-center text-muted-foreground"
      >
        Add New Task
      </p>
    </div>
  );
};

export default NewTask;
