"use client";
import { taskContext } from "@/context/TaskContext";
import React, { useContext, useState } from "react";

const TaskInput = () => {
  const [input, setInput] = useState("");

  const { addTask } = useContext(taskContext);

  return (
    <form
      className="h-full w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const createdTask = { task: input, createdAt: Date.now() };
        addTask(createdTask);
        // update cell selected
      }}
    >
      <input
        type="text"
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <p>{input}</p>
    </form>
  );
};

export default TaskInput;
