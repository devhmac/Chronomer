export type SubTask = {
  id: string;
  task: string;
  description: string;
  // status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  status: string;
  timeToComplete: number;
  order: number;
  tags: string[];
  project: string;
  isComplete: boolean;
  createdAt: Date;
  completedAt: Date | null;
  timeSpent: number;
  archived: boolean;
};

export type Task = {
  id: string;
  task: string;
  description: string;
  // status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  status: string;
  tags: string[];
  project: string | null;
  subTasks: SubTask[];
  timeToComplete: number;
  order: number;
  isComplete: boolean;
  createdAt: Date;
  completedAt: Date | null;
  timeSpent: number;
  archived: boolean;
};
