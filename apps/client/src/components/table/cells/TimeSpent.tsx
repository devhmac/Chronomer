import React from "react";

type props = {
  timersComplete: number;
  timeToComplete: number;
  taskId: string;
};

const TimeSpent = ({ timersComplete, timeToComplete, taskId }) => {
  return (
    <div>
      {timersComplete}/{timeToComplete}
    </div>
  );
};

TimeSpent.propTypes = {};

export default TimeSpent;
