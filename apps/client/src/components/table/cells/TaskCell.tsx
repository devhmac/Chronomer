import { Input } from "@/components/ui/input";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";

type props = {
  task?: any;
};

const TaskCell = ({ task }: { task: Task }) => {
  const { addTask, updateTask } = useContext(taskContext);

  const [isEdit, setIsEdit] = useState(task && task.id === "-1" ? true : false);
  const [input, setInput] = useState(task ? task.task : "");

  const test = task.task;

  const isExistingTask = task.id !== "-1";

  const inputRef = useRef<HTMLParagraphElement>(null);

  const submitTaskChange = (input: string) => {
    console.log("submit change");
    // means input was not changed, do not submit an update request
    if (input === task.task) return setIsEdit(false);

    const newTask = { ...task, task: input };
    console.log("task before submission", task);
    console.log(task);
    console.log(isExistingTask);
    setIsEdit(false);
    if (isExistingTask) {
      updateTask(newTask);
    } else {
      addTask(newTask);
    }
  };

  const cancelChange = () => {
    console.log("cancel");
    console.log("task at time of cancel", task.task);
    console.log("state at time of cancel", input);
    setInput((prev) => task.task);
    setIsEdit(false);
  };

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div
      className=" w-full  flex-grow text-left"
      // onClick={(e) => {
      //   setIsEdit(true);
      // }}
    >
      {isEdit || input === "" ? (
        <div onBlur={() => submitTaskChange(input)}>
          {/* <Textarea
            ref={inputRef}
            className=" flex min-w-full resize-none"
            value={input}
            onChange={(e) => {
              e.preventDefault();
              setInput(e.target.value);
              // console.log(task);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitTaskChange(input);
              } else if (e.key === "Escape") {
                cancelChange();
              }
            }}
          /> */}
          <p
            ref={inputRef}
            className="rounded-md border-input bg-muted/30 p-2 focus:outline-input"
            contentEditable
            role="textbox"
            tabIndex={0}
            suppressContentEditableWarning={true}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitTaskChange(input);
              } else if (e.key === "Escape") {
                console.log("cancel state", input);

                cancelChange();
              }
            }}
            onInput={(e: any) => {
              e.preventDefault();
              // console.log("target", e.target);
              setInput(e.target.textContent);
              console.log("state", input);
            }}
          >
            {task.task}
          </p>
          {/* <Button onClick={() => cancelChange()}>test</Button> */}
        </div>
      ) : (
        <div
          onClick={(e) => {
            setIsEdit(true);
          }}
          className=" rounded-md border-input p-2 hover:border"
        >
          <p className={cn("line-clamp-2 w-full ")}>{input}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCell;
