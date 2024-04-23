import { cn } from "@/lib/utils/utils";
import { CircleOff } from "lucide-react";
import { Task } from "@/lib/types/types";
import React from "react";

const CancelTask = ({ task }: { task: Task }) => {
  return (
    <div className=" hover:cursor-pointer" aria-label="Cancel Task Creation">
      <CircleOff className={cn("h-4 w-4 text-rose-400 hover:text-rose-600")} />
    </div>
  );
};

export default CancelTask;
