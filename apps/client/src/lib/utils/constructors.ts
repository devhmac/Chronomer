export class Subtask {
  task: string;
  descripton: string;
  status: "COMPLETE" | "INPROGRESS" | "BACKLOG" | "BLOCKED";
  isActive: boolean;
  timeToComplete: number;
  order: number;
  createdAt: Date;
  completedAt: Date | null;
  timersComplete: number;

  constructor(taskDesc: string) {
    this.task = taskDesc;
    this.descripton = "";
    this.status = "BACKLOG";
    this.isActive = false;
    this.timeToComplete = 0;
    this.order = 0;
    this.createdAt = new Date();
    this.completedAt = null;
    this.timersComplete = 0;
  }
}

export class Task extends Subtask {
  subtask: Subtask[];
  constructor(task: string) {
    super(task);
    this.subtask = [];
  }
}
