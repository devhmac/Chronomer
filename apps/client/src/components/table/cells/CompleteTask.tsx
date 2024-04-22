import { cn } from "@/lib/utils/utils";
import { CircleCheckBig } from "lucide-react";
import React from "react";

const CompleteTask = ({ task }) => {
  const isComplete = false;
  return (
    <div className=" hover:cursor-pointer">
      <CircleCheckBig
        className={cn(
          "h-4 w-4 text-zinc-400 ",
          isComplete ? "text-green-400" : "text-zinc-400 hover:text-zinc-200",
        )}
      />
    </div>
  );
};

export default CompleteTask;
