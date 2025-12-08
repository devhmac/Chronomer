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
  }, [isEdit]);

  return (
    <div
      className=" w-full  grow text-left"
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
          className=" flex  flex-row items-center  rounded-md border border-input bg-muted/30 p-2 focus:border-input"
        >
          <div
            ref={inputRef}
            className="grow  focus:outline-hidden"
            contentEditable
            role="textbox"
            tabIndex={0}
            suppressContentEditableWarning={true}
            onFocus={
              (e) => {
                if (inputRef.current) {
                  const range = document.createRange();
                  const selection = window.getSelection();
                  range.selectNodeContents(inputRef.current);
                  range.collapse(false); // Collapse the range to the end
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                }
                // let length = inputRef.current?.textContent.length;
                // inputRef.current?.setSelectionRange(length, length);
              }
              // e.currentTarget.setSelectionRange(
              //   e.currentTarget.textContent?.length,
              //   e.currentTarget.textContent?.length,
              // )
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
          {task.id !== "-1" && (
            <button
              id="cancel-button"
              className=" ml-2 hover:cursor-pointer"
              aria-label="Cancel Task Creation"
            >
              <CircleOff
                onClick={() => {
                  cancelChange();
                }}
                className={cn("h-4 w-4 text-rose-400 hover:text-rose-600")}
              />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={(e) => {
            setIsEdit(true);
          }}
          className=" h-full w-full cursor-text rounded-md border border-white/0  p-2 align-middle hover:border hover:border-input"
        >
          <p className={cn("line-clamp-1 w-full ")}>{input}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCell;
