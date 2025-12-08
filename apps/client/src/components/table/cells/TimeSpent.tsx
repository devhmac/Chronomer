import { cn, derivePercentComplete, minutesToTime } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useState } from "react";
import { taskContext } from "@/providers/TaskContext";
import { Task } from "@/lib/types/types";

type props = {
  timeSpent: number;
  timeToComplete: number;
  taskId: string;
  task: Task;
};

function padTwoDigits(num: number) {
  return num.toString().padStart(2, "0");
}

const messageFormatter = (spent: number, target: number) => {
  const targetFormatted = minutesToTime(target);
  const spendFormatted = minutesToTime(spent);
  if (spent === 0 && target <= 0) {
    return "set estimate";
  }
  if (spent === 0 && target > 0) {
    return `-- / ${targetFormatted}`;
  }
  if (spent > 0 && target <= 0) {
    return spendFormatted;
  }
  return `${spendFormatted} / ${targetFormatted}`;
};
const estimatedTimeToMinutes = (hours: string, minutes: string) => {
  const hoursOrZero = parseInt(hours) ?? 0;

  return hoursOrZero * 60 + (parseInt(minutes) ?? 0);
};

const TimeSpent = ({ timeSpent, timeToComplete, taskId, task }: props) => {
  const { updateTask } = useContext(taskContext);
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(
    Math.floor(task.timeToComplete / 60).toString() || "0",
  );
  const [minutes, setMinutes] = useState(
    (task.timeToComplete % 60).toString() || "0",
  );

  const percentComplete = derivePercentComplete(timeSpent, timeToComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimatedMinutes = estimatedTimeToMinutes(hours, minutes);
    // Here you can handle the submission of the timer estimate
    const updatedTask = { ...task, timeToComplete: estimatedMinutes };
    updateTask(updatedTask);
    setOpen(false);
  };
  const time = minutesToTime(timeSpent);
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild onClick={() => setOpen(true)}>
          <Button
            variant="outline"
            className="relative h-auto w-full cursor-pointer overflow-hidden rounded-md border px-1 py-1 text-xs"
          >
            <div
              style={
                percentComplete >= 10
                  ? { width: `${percentComplete}%` }
                  : { display: "none" }
              }
              className={cn(" bg-status-green absolute  inset-0  z-0 min-w-2")}
            />
            <p
              className={cn(
                "relative z-10 truncate	",
                timeSpent === 0 && timeToComplete === 0
                  ? "text-muted-foreground"
                  : null,
              )}
            >
              {messageFormatter(timeSpent, timeToComplete)}
            </p>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Timer Estimate</h4>
              <p className="text-sm text-muted-foreground">
                Set the estimated time for your task.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <p>Hours</p>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <p>Minutes</p>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
            <Button type="submit" onClick={handleSubmit}>
              Set Timer
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default TimeSpent;
