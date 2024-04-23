import { Input } from "@/components/ui/input";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Task } from "@/lib/types/types";

type props = {
  task?: any;
};

const TaskCell = ({ task }: { task: Task }) => {
  const [isEdit, setIsEdit] = useState(task && task.id === "-1" ? true : false);
  const [input, setInput] = useState(task ? task.task : "");

  const inputRef = useRef<HTMLInputElement>(null);

  const submitTaskChange = () => {
    setIsEdit(false);
    // rest of api request/save logic
  };
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div
      className="text-left"
      onClick={(e) => {
        setIsEdit(true);
        // if (inputRef.current) {
        //   inputRef.current.focus();
        // }
      }}
    >
      {isEdit || input === "" ? (
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            e.preventDefault();
            setInput(e.target.value);
            console.log(task);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitTaskChange();
            }
          }}
          onBlur={() => submitTaskChange()}
        />
      ) : (
        <p className="rounded-md border-input p-2 hover:border ">{input}</p>
      )}
    </div>
  );
};

export default TaskCell;
