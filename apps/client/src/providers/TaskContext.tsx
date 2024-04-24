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
// import Task from "shared-types";

type TaskContext = {
  tasks: Task[];
  // setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};
// INSTEAD OF ALL THIS YOU MIGHT JUST GET SERVER SIDE AND PASS TO COMPONENTS AS NEEDED
const defaultTasksState = {
  tasks: [],
  addTask: () => {},
  setTasks: () => {},
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
      if(task.task !== ''){
        task.id = 

      }
      // Update state with new task block but dont save
      setTasks((prev) => [...prev, task]);
      return;
    }
    try {
      const updatedTasks = [...tasks, task];
      if (!user) {
        addTasksLocal(updatedTasks);
        setTasks(getLocalItem());
      }
    } catch (error) {}
    console.log("adding task");
  };

  const updateTasks = (tasks: Task[], incomingTask: Task) => {
    return tasks.map((task) => {
      if (task.id === incomingTask.id) {
        return incomingTask;
      }
    });
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
