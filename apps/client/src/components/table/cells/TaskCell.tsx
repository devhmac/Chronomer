import { Input } from "@/components/ui/input";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Task } from "@/lib/types/types";
import { taskContext } from "@/providers/TaskContext";

type props = {
  task?: any;
};

const TaskCell = ({ task }: { task: Task }) => {
  const { addTask, updateTask } = useContext(taskContext);

  const [isEdit, setIsEdit] = useState(task && task.id === "-1" ? true : false);
  const [input, setInput] = useState(task ? task.task : "");

  const isExistingTask = task.id !== "-1";

  const inputRef = useRef<HTMLInputElement>(null);

  const submitTaskChange = (input: string) => {
    // means input was not changed, do not submit an update request
    if (input === task.task) return setIsEdit(false);
    const newTask = task;
    console.log("task before submission", task);
    newTask.task = input;
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
      className="text-left"
      onClick={(e) => {
        setIsEdit(true);
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
        <p className="rounded-md border-input p-2 hover:border ">{input}</p>
      )}
    </div>
  );
};

export default TaskCell;
