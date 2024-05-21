import { Input } from "@/components/ui/input";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { CircleOff } from "lucide-react";

type props = {
  task?: any;
};

const TaskCell = ({ task }: { task: Task }) => {
  const { addTask, updateTask } = useContext(taskContext);

  const [isEdit, setIsEdit] = useState(task && task.id === "-1" ? true : false);
  const [input, setInput] = useState(task ? task.task : "");

  const test = task.task;

  const isExistingTask = task.id !== "-1";

  const inputRef = useRef<HTMLDivElement>(null);

  const submitTaskChange = (input: string) => {
    console.log("submit change");
    // means input was not changed, do not submit an update request
    if (input === task.task) return setIsEdit(false);

    const newTask = { ...task, task: input };
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
    setInput((prev) => task.task);
    setIsEdit(false);
  };

  useLayoutEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    let selection = window.getSelection();
    console.log("selection", window.getSelection()?.getRangeAt(0));
    setSelectionRange(
        e.currentTarget.textContent?.length,
        e.currentTarget.textContent?.length,
      // )
  }, [isEdit]);

  return (
    <div
      className=" w-full  flex-grow text-left"
      // onClick={(e) => {
      //   setIsEdit(true);
      // }}
    >
      {isEdit || input === "" ? (
        <div
          onBlur={(e) => {
            if (e.relatedTarget?.id === "cancel-button") {
              return;
            }
            return submitTaskChange(input);
          }}
          className=" flex  flex-row items-center"
        >
          <div
            ref={inputRef}
            className="flex-grow rounded-md border-input bg-muted/30 p-2 focus:outline-input"
            contentEditable
            role="textbox"
            tabIndex={0}
            suppressContentEditableWarning={true}
            onFocus={(e) =>
              // e.currentTarget.setSelectionRange(
              //   e.currentTarget.textContent?.length,
              //   e.currentTarget.textContent?.length,
              // )
              console.log("input focused", e)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitTaskChange(input);
              } else if (e.key === "Escape") {
                cancelChange();
              }
            }}
            onInput={(e: any) => {
              e.preventDefault();
              setInput(e.target.textContent);
            }}
          >
            {task.task}
          </div>
          <button
            id="cancel-button"
            className=" hover:cursor-pointer"
            aria-label="Cancel Task Creation"
          >
            <CircleOff
              onClick={() => {
                cancelChange();
              }}
              className={cn("h-4 w-4 text-rose-400 hover:text-rose-600")}
            />
          </button>
        </div>
      ) : (
        <div
          onClick={(e) => {
            setIsEdit(true);
          }}
          className="cursor-text rounded-md border-input p-2 hover:border"
        >
          <p className={cn("line-clamp-2 w-full ")}>{input}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCell;
