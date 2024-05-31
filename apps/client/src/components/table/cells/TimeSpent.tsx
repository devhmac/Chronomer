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
  // const percentComplete = 10;

  const minutesToTime = (time: number) => {
    const hours = Math.floor(time / 60);
    const min = time % 60;
    return hours === 0 ? `${min}m` : `${hours}h ${min}m`;

    // return `${padTwoDigits(hours)}:${padTwoDigits(min)}`;
  };

  const time = minutesToTime(timeSpent);
  return (
    <div className="relative overflow-hidden rounded-md border p-1 hover:bg-accent">
      <div
        className={cn(
          " absolute inset-0  z-0 min-w-2 bg-green-800",
          percentComplete >= 10 ? `w-[${percentComplete}%]` : "hidden",
        )}
      ></div>
      <p className="relative z-10">
        {minutesToTime(timeSpent)} / {minutesToTime(timeToComplete)}{" "}
      </p>
    </div>
  );
};

export default TimeSpent;
