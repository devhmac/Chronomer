import { Input } from "@/components/ui/input";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type props = {
  task?: any;
};

const TaskCell = ({ task }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(task ? task.task : "");

  const inputRef = useRef<HTMLInputElement>();

  const submitTaskChange = () => {
    setIsEdit(false);
    // rest of api request/save logic
  };
  useLayoutEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div
      className="hover:  w-full "
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
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitTaskChange();
            }
          }}
          onBlur={() => submitTaskChange()}
        />
      ) : (
        <p className="border-primary hover:border">{input}</p>
      )}
    </div>
  );
};

export default TaskCell;
