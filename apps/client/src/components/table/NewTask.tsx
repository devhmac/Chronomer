"use client";
import { taskContext } from "@/providers/TaskContext";
import React, { ReactNode, useContext, useState } from "react";
import { Input } from "../ui/input";
import { Task } from "@/lib/utils/constructors";
import StatusSelect from "./cells/StatusSelect";

const NewTask = () => {
  const { addTask } = useContext(taskContext);

  return (
    <div>
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
