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
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";
// import Task from "shared-types";

type TaskContext = {
  tasks: Task[];
  // setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};
// INSTEAD OF ALL THIS YOU MIGHT JUST GET SERVER SIDE AND PASS TO COMPONENTS AS NEEDED
const defaultTasksState = {
  tasks: [],
  addTask: () => {},
  setTasks: () => {},
  updateTask: () => {},
};
const user = false;

export const taskContext = createContext<TaskContext>(defaultTasksState);

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[] | []>([]);

  const { setLocalItem, getLocalItem, supportsLocalStorage } =
    useLocalStorage("chronomer.tasks");

  const addTasksLocal = (tasks: Task[]) => {
    return setLocalItem(tasks);
  };

  useEffect(() => {
    // Will need check somewhere on if logged in to determine action here
    if (!user) {
      if (supportsLocalStorage() === false) {
        false;
      }

      const localTasks = getLocalItem() || [];
      console.log(localTasks);
      setTasks(localTasks);
    }
  }, []);

  const addTask = (task: Task) => {
    if (task.id === "-1") {
      if (task.task === "") {
        //means brand new task row, update state with new task block but dont save
        setTasks((prev) => [...prev, task]);
        return;
      }
      task.id = uuidv4();
    }
    try {
      if (!user) {
        const updatedTasks = [...tasks, task];
        addTasksLocal(updatedTasks);
        setTasks(updatedTasks);
      }
    } catch (error) {}
    console.log("adding task");
  };

  const updateTask = (incomingTask: Task) => {
    console.log("updating task");
    if (!user) {
      const localTasks = getLocalItem();
      const updatedTasks = localTasks.map((task: Task) => {
        if (task.id === incomingTask.id) {
          return incomingTask;
        }
      });
      addTasksLocal(updatedTasks);
    }
  };

  const editTaskValue = (updatedTask: Task) => {};

  return (
    <taskContext.Provider
      value={{
        tasks,
        addTask,
        setTasks,
        updateTask,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
