import { Task } from "@/lib/types/types";

const date = new Date();

export const data: Task[] = [
  {
    id: "1",
    task: "Need to finish timer",
    description: "",
    status: "BLOCKED",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: new Date(),
    completedAt: null,
    timersComplete: 4,
  },
  {
    id: "2",
    task: "Need to finish to do list",
    description: "",
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: new Date(),
    completedAt: null,
    timersComplete: 6,
  },
  {
    id: "3",
    task: "What is next on this task list?",
    description: "",
    status: "BACKLOG",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: new Date(),
    completedAt: null,
    timersComplete: 2,
  },
  // ...
];
