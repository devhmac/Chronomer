import { cn } from "@/lib/utils/utils";
import React, { useState } from "react";

type props = {
  timeSpent: number;
  timeToComplete: number;
  taskId: string;
};

const TimeSpent = ({ timeSpent, timeToComplete, taskId }: props) => {
  function padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }

  const derivePercentComplete = (timeSpent: number, timeTarget: number) => {
    if (timeSpent === 0 || timeToComplete === 0) return 0;
    const decimalPercent = Number((timeSpent / timeTarget).toFixed(1));
    return decimalPercent * 100;
  };
  const percentComplete = derivePercentComplete(timeSpent, timeToComplete);

  const minutesToTime = (time: number) => {
    const hours = Math.floor(time / 60);
    const min = time % 60;
    return hours === 0 ? `${min}m` : `${hours}h ${min}m`;

    // return `${padTwoDigits(hours)}:${padTwoDigits(min)}`;
  };
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
  const time = minutesToTime(timeSpent);
  return (
    <div className="relative overflow-hidden rounded-md border px-3 py-1 hover:bg-accent">
      <div
        style={
          percentComplete >= 10
            ? { width: `${percentComplete}%` }
            : { display: "none" }
        }
        className={cn(" absolute inset-0  z-0  min-w-2 bg-green-800")}
      ></div>
      <p
        className={cn(
          "relative z-10 truncate",
          timeSpent === 0 && timeToComplete === 0
            ? "text-muted-foreground"
            : null,
        )}
      >
        {messageFormatter(timeSpent, timeToComplete)}
      </p>
    </div>
  );
};

export default TimeSpent;
