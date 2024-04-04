"use client";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
} from "react";

type Timer = {
  timerLength: number;
  rest: number;
  lastTimerSelected: number | undefined;
  startTS: Date | undefined;
  endTS: Date | undefined;
  timersComplete: number;
  restsComplete: number;
  timerType: "POMODORO" | "CUSTOM";
  currentMode: "TIMER" | "REST";
};

type Task = {
  id: string;
  task: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  subTasks: Task[];
  timeToComplete: number;
  order: number;
};

type TaskContext = {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
};
// YOU DID ALL THIS BUT ACTUALLY WHAT DO YOU NEED AS A CONTEXT CANT ALL THIS JUST BE IN THE TIMER HOOK?
// MAYBE JUST KEEP TIMER ON, #'s COMPLETED, MAYBE TIMESTAMPS?
const defaultTasksState = {
  tasks: [],
  setTasks: () => {},
};
export const timerContext = createContext<TaskContext>(defaultTasksState);

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[] | []>(defaultTasksState.tasks);

  // const [timeRemaining, setTimeRemaining] = useState(
  //   defaultTimerState.timerState.timerLength,
  // );

  return (
    <timerContext.Provider
      value={{
        tasks,
        setTasks,
      }}
    >
      {children}
    </timerContext.Provider>
  );
};
