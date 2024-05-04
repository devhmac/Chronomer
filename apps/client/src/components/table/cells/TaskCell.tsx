import { Input } from "@/components/ui/input";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";

type props = {
  task?: any;
};

const TaskCell = ({ task }: { task: Task }) => {
  const { addTask, updateTask } = useContext(taskContext);

  const [isEdit, setIsEdit] = useState(task && task.id === "-1" ? true : false);
  const [input, setInput] = useState(task ? task.task : "");

  const isExistingTask = task.id !== "-1";

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submitTaskChange = (input: string) => {
    // means input was not changed, do not submit an update request
    if (input === task.task) return setIsEdit(false);

    const newTask = { ...task, task: input };
    console.log("task before submission", task);
    console.log(task);
    setIsEdit(false);
    console.log(isExistingTask);
    if (isExistingTask) {
      updateTask(newTask);
    } else {
      addTask(newTask);
    }
  };
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div
      className=" w-full  flex-grow text-left"
      onClick={(e) => {
        setIsEdit(true);
      }}
    >
      {isEdit || input === "" ? (
        <Textarea
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
            }
          }}
          onBlur={() => submitTaskChange(input)}
        />
      ) : (
        <div className=" rounded-md border-input p-2 hover:border">
          <p className={cn("line-clamp-2 w-full ")}>{input}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCell;
