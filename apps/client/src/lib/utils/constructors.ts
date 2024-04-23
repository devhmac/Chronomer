import { Task as TaskType } from "../types/types";

export class Subtask {
  id: string;
  task: string;
  description: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  timeToComplete: number;
  order: number;
  createdAt: number;
  taskComplete: boolean;
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
    this.createdAt = Date.now();
    this.taskComplete = false;
    this.completedAt = null;
    this.timersComplete = 0;
  }
}

export class Task extends Subtask {
  subtasks: Subtask[];
  constructor(task?: string) {
    super(task);
    this.subtasks = [];
  }
}
