import React from "react";

type props = {
  timersComplete: number;
  timeToComplete: number;
  taskId: string;
};

const TimeSpent = ({ timersComplete, timeToComplete, taskId }: props) => {
  function padTwoDigits(num) {
    return num.toString().padStart(2, "0");
  }
  const minutesToTime = (time) => {
    const hours = Math.floor(timeToComplete / 60);
    const min = timeToComplete % 60;
    return `${padTwoDigits(hours)}:${padTwoDigits(min)}`;
  };
  const time = minutesToTime(timeToComplete);
  return <div>{time}</div>;
};

export default TimeSpent;
