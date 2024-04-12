"use client";
import { taskContext } from "@/context/TaskContext";
import React, { useContext, useState } from "react";
import { Input } from "../ui/input";

const TaskInput = () => {
  const [input, setInput] = useState("");
  const [toggleInput, setToggleInput] = useState(false);

  const { addTask } = useContext(taskContext);

  return (
    <>
      <p onClick={() => setToggleInput(true)} className="">
        test
      </p>
      <form
        onClick={(e) => {
          e.preventDefault();
          return setToggleInput(true);
        }}
        // className=" h-full w-full"
        onSubmit={(e) => {
          e.preventDefault();
          const createdTask = { task: input, createdAt: Date.now() };
          addTask(createdTask);
          // update cell selected
        }}
      >
        {toggleInput && (
          <Input
            type="text"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
        )}
        <p>{input}</p>
      </form>
    </>
  );
};

export default TaskInput;
