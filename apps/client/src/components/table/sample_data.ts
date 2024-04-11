type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const data = [
  {
    task: "Need to finish timer",
    status: "INPROGRESS",
    isActive: false,
    subTasks: [],
    timeToComplete: 8,
    order: 0,
  },
  {
    task: "Need to finish to do list",
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
