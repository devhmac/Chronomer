"use client";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
  useEffect,
} from "react";
import { data } from "@/components/table/sample_data";
import { Task } from "@/lib/types/types";
// import Task from "shared-types";

type TaskContext = {
  tasks: Task[];
  // setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
};
// INSTEAD OF ALL THIS YOU MIGHT JUST GET SERVER SIDE AND PASS TO COMPONENTS AS NEEDED
const defaultTasksState = {
  tasks: [],
  addTask: () => {},
  setTasks: () => {},
};

export const taskContext = createContext<TaskContext>(defaultTasksState);

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[] | []>([]);

  useEffect(() => {
    setTasks(data);
  }, []);

  console.log(tasks);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    console.log("adding task");
  };

  const editTaskValue = (updatedTask: Task) => {};

  return (
    <taskContext.Provider
      value={{
        tasks,
        addTask,
        setTasks,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
