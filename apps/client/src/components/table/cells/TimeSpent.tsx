import React from "react";

type props = {
  timersComplete: number;
  timeToComplete: number;
  taskId: string;
};

const TimeSpent = ({ timersComplete, timeToComplete, taskId }: props) => {
  function padTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }
  const minutesToTime = (time: number) => {
    const hours = Math.floor(time / 60);
    const min = time % 60;
    return `${padTwoDigits(hours)}:${padTwoDigits(min)}`;
  };

  const time = minutesToTime(timeToComplete);
  return <div className="rounded-md border p-1 hover:bg-accent">{time}</div>;
};

export default TimeSpent;
