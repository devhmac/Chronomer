export type Task = {
  id: string;
  task: string;
  description: string;
  // status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  status: string;
  isActive: boolean;
  subTasks: Task[];
  timeToComplete: number;
  order: number;
  isComplete: boolean;
  createdAt: Date;
  completedAt: Date | null;
  timersComplete: number;
};
