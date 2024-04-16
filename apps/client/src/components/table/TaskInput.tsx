"use client";
import { taskContext } from "@/context/TaskContext";
import React, { useContext, useState } from "react";
import { Input } from "../ui/input";
import { Task } from "@/lib/utils/constructors";
import StatusSelect from "./cells/StatusSelect";

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
          const createdTask = new Task(input);
          addTask(createdTask);
          return setToggleInput(true);
        }}
        // className=" h-full w-full"
        onSubmit={(e) => {
          e.preventDefault();
          // const createdTask = { task: input, createdAt: Date.now() };
          const createdTask = new Task(input);
          console.log(createdTask);
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
        <StatusSelect />
      </form>
    </>
  );
};

export default TaskInput;
