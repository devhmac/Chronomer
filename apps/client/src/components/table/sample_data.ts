type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const data = [
  {
    id: 1,
    task: "Need to finish timer",
    description: "",
    status: "BLOCKED",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: 1713186277,
    completedAt: null,
    timersComplete: 2,
  },
  {
    id: 2,
    task: "Need to finish to do list",
    description: "",
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: 1713186277,
    completedAt: null,
    timersComplete: 2,
  },
  {
    id: 3,
    task: "What is next on this task list?",
    description: "",
    status: "BACKLOG",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
    createdAt: 1713186277,
    completedAt: null,
    timersComplete: 2,
  },
  // ...
];

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
