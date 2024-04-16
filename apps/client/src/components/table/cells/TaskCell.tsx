import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const TaskCell = ({ task }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [input, setInput] = useState(task.task);
  return (
    <div
      className="hover:  w-full "
      onClick={(e) => {
        return setIsEdit(true);
      }}
    >
      {isEdit || input === "" ? (
        <Input
          value={input}
          onChange={(e) => {
            e.preventDefault();
            setInput(e.target.value);
          }}
        />
      ) : (
        <p className="border-primary hover:border">{task.task}</p>
      )}
    </div>
  );
};

export default TaskCell;
