import { Task as TaskType } from "../types/types";

export class SubTask {
  id: string;
  task: string;
  description: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  timeToComplete: number;
  order: number;
  createdAt: Date;
  isComplete: boolean;
  completedAt: Date | null;
  timersComplete: number;

  constructor(taskDesc?: string) {
    this.id = "-1";
    this.task = taskDesc || "";
    this.description = "";
    this.status = "BACKLOG";
    this.isActive = false;
    this.timeToComplete = 0;
    this.order = 0;
    this.createdAt = new Date();
    this.isComplete = false;
    this.completedAt = null;
    this.timersComplete = 0;
  }
}

export class Task extends SubTask {
  subTasks: SubTask[];
  constructor(task?: string) {
    super(task);
    this.subTasks = [];
  }
}
