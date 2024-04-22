import { cn } from "@/lib/utils/utils";
import { CircleOff } from "lucide-react";
import React from "react";

const CancelTask = ({ task }) => {
  return (
    <div className=" hover:cursor-pointer">
      <CircleOff className={cn("h-4 w-4 text-rose-400 hover:text-rose-600")} />
    </div>
  );
};

export default CancelTask;
