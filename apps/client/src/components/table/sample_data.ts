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
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
  },
  {
    id: 2,
    task: "Need to finish to do list",
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
  },
  {
    id: 3,
    task: "What is next on this task list?",
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
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
