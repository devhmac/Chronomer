"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { off } from "process";
import { timeStamp } from "console";

export const Timer = () => {
  // new Date(SECONDS * 1000).toISOString().substring(14, 19) //just min & sec

  // at a high level I will need to
  // - timer on or off
  // - time amount
  // - start or end timeStamp
  // - is paused? - no dont think i need this I can just do if time past end date done

  // could also export from custom hook hours, mins, seconds

  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [dt, setDt] = useState<null | string>(null);

  const displayTime = new Date(time * 1000).toISOString().substring(12, 19);
  // const startDT = new Date(Date.now()).toISOString();

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        if (time === 0) {
          setTimerRunning(false);
          clearInterval(interval);
        } else {
          setTime((prev) => prev - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time, timerRunning]);

  return (
    <div>
      <div>{dt}</div>
      <div>{time}</div>
      <div>{displayTime}</div>
      <div>timer</div>
      <Button
        onClick={() => {
          setTime(900);
          setDt(new Date(Date.now()).toISOString());
        }}
      >
        15 min
      </Button>

      <Button
        onClick={() => {
          setTimerRunning((prev) => !prev);
        }}
      >
        {timerRunning ? "pause" : "start"}
      </Button>
    </div>
  );
};
