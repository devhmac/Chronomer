export type Task = {
  id: string;
  task: string;
  description: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  subTasks: Task[];
  timeToComplete: number;
  order: number;
  createdAt: Date;
  completedAt: Date | null;
  timersComplete: number;
};
