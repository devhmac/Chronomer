import { Task as TaskType } from "../types/types";

export class SubTask {
  id: string;
  task: string;
  description: string;
  status: string;
  timeToComplete: number;
  order: number;
  tags: string[];
  project: string | null;
  isComplete: boolean;
  createdAt: Date;
  completedAt: Date | null;
  timeSpent: number;
  archived: boolean;

  constructor(taskDesc?: string) {
    this.id = "-1";
    this.task = taskDesc || "";
    this.description = "";
    this.status = "BACKLOG";
    this.tags = [];
    this.project = null;
    this.timeToComplete = 0;
    this.order = 0;
    this.createdAt = new Date();
    this.isComplete = false;
    this.completedAt = null;
    this.timeSpent = 0;
    this.archived = false;
  }
}

export class Task extends SubTask {
  subTasks: SubTask[];
  constructor(task?: string) {
    super(task);
    this.subTasks = [];
  }
}
