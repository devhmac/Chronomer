"use client";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
} from "react";
import { data } from "@/components/table/sample_data";

type Task = {
  task: string;
  descripton: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  subTasks: Task[];
  timeToComplete: number;
  order: number;
  createdAt: Date;
  completedAt: Date | null;
  timersComplete: number;
};

const statusMap = {
  COMPLETE: "Complete",
  INPROGRESS: "In Progress",
  BACKLOG: "Backlog",
  BLOCKED: "Blocked",
} as {
  COMPLETE: string;
  INPROGRESS: string;
  BACKLOG: string;
  BLOCKED: string;
};

type TaskContext = {
  tasks: Task[];
  // setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
};
// INSTEAD OF ALL THIS YOU MIGHT JUST GET SERVER SIDE AND PASS TO COMPONENTS AS NEEDED
const defaultTasksState = {
  tasks: data,
  addTask: () => {},
};
export const taskContext = createContext<TaskContext>(defaultTasksState);

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[] | []>(defaultTasksState.tasks);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  // const [timeRemaining, setTimeRemaining] = useState(
  //   defaultTimerState.timerState.timerLength,
  // );

  return (
    <taskContext.Provider
      value={{
        tasks,
        addTask,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
