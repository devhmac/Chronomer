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
  deleteTask: (task: Task) => void;
  setTaskActive: (taskId: Task["id"]) => void;
  activeTask: Task | undefined;
  tableLoading: boolean;
  incrementActiveTaskTime: (minutes: number) => void;
  clearActiveTask: () => void;
};
// INSTEAD OF ALL THIS YOU MIGHT JUST GET SERVER SIDE AND PASS TO COMPONENTS AS NEEDED
const defaultTasksState = {
  tasks: [],
  addTask: () => {},
  setTasks: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  setTaskActive: () => {},
  activeTask: undefined,
  tableLoading: true,
  incrementActiveTaskTime: () => {},
  clearActiveTask: () => {},
};

const user = false;

export const taskContext = createContext<TaskContext>(defaultTasksState);

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[] | []>([]);
  // use these for a row level loading spinner on any updates, and a table level skeleton load
  const [tableLoading, setTableLoading] = useState(true);
  const [rowLoading, setRowLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);

  const { setLocalItem, getLocalItem, supportsLocalStorage } =
    useLocalStorage("tasks");

  const {
    setLocalItem: setActiveTaskLocal,
    getLocalItem: getActiveTaskLocal,
    deleteItem: deleteActiveTask,
  } = useLocalStorage("active-task");

  const addTasksLocal = (tasks: Task[]) => {
    return setLocalItem(tasks);
  };

  const getActiveTaskByID = (taskId: string) => {
    if (!user) {
      return getLocalItem()?.filter((task: Task) => {
        return task.id === taskId;
      })[0];
    }
  };

  useEffect(() => {
    // Will need check somewhere on if logged in to determine action here
    if (!user) {
      console.log("table loading", tableLoading);
      if (supportsLocalStorage() === false) {
        false;
      }

      const localTasks = getLocalItem() || [];
      console.log(localTasks);
      setTasks(localTasks);
      setTableLoading(false);

      const activeTaskID = getActiveTaskLocal();
      if (activeTaskID) {
        setActiveTask(getActiveTaskByID(activeTaskID));
      }
    }
  }, []);

  const setTaskActive = (taskId: Task["id"]) => {
    if (!user) {
      if (!taskId) return;
      setActiveTaskLocal(taskId);
      const filteredActiveTask = getLocalItem().filter((task: Task) => {
        return task.id === taskId;
      })[0];
      setActiveTask(filteredActiveTask);
      // should do some error handling, but the task should always exist in tasks
    }
  };

  const clearActiveTask = () => {
    if (!user) {
      deleteActiveTask();
      setActiveTask(undefined);
    }
  };

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
        const currentlocalTasks = getLocalItem() || [];
        const updatedTasks = [...currentlocalTasks, task];
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
        return task.id === incomingTask.id ? incomingTask : task;
      });
      addTasksLocal(updatedTasks);
      setTasks(updatedTasks);
      if (incomingTask.id === activeTask?.id) {
        setActiveTask(incomingTask);
      }
      console.log("iupdated tasks", updatedTasks);
    }
  };

  const deleteTask = (deletingTask: Task) => {
    if (!user) {
      const localTasks = getLocalItem();
      const taskList = localTasks.filter(
        (item: Task) => deletingTask.id !== item.id,
      );

      // removeObjFromArrOnID(localTasks, deletingTask);
      const updatedTasks = localTasks.filter(
        (item: Task) => item.id !== deletingTask.id,
      );
      addTasksLocal(updatedTasks);
      setTasks(updatedTasks);
    }
  };

  const cancelUnsavedTask = (task: Task) => {
    if (task.id !== "-1") return;
    const updated = tasks.filter(
      (item) => item.id !== "-1" && item.createdAt !== task.createdAt,
    );
    setTasks(updated);
  };

  // console.log(activeTask);

  const incrementTaskTimeByID = (TaskId: Task["id"], minutes: number) => {
    const activeTask = getActiveTaskByID(TaskId);
    console.log("active task in increment", activeTask);
    activeTask.timeSpent += minutes;
    console.log("active task after increment", activeTask);
    updateTask(activeTask);
    setActiveTask(activeTask);
  };
  const incrementActiveTaskTime = (minutes: number) => {
    if (getActiveTaskLocal()) {
      incrementTaskTimeByID(getActiveTaskLocal(), minutes);
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
        deleteTask,
        activeTask,
        setTaskActive,
        tableLoading,
        incrementActiveTaskTime,
        clearActiveTask,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};
