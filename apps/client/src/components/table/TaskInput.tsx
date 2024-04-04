"use client";
import React, { useState } from "react";

const TaskInput = () => {
  const [input, setInput] = useState("");
  return (
    <form
      className="h-full w-full"
      onSubmit={(e) => {
        e.preventDefault();
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
