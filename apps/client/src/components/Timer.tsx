"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { off } from "process";
import { timeStamp } from "console";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const Timer = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // new Date(SECONDS * 1000).toISOString().substring(14, 19) //just min & sec

  // at a high level I will need to
  // - timer on or off
  // - time amount
  // - start or end timeStamp
  // - is paused? - no dont think i need this I can just do if time past end date done

  // could also export from custom hook hours, mins, seconds

  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTS, setStartTS] = useState<null | string>(null);
  const [endTS, setEndTS] = useState<null | string>(null);

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
  // console.log(dayjs().add(900, "second").format());
  // console.log(dayjs().format());

  return (
    <div className="bg-gradient-to-tr from-sky-300 to-purple-300 p-5 rounded-md">
      <div>start timestamp: {startTS}</div>
      <div>end timestamp: {endTS}</div>
      <div>{time}</div>
      <div>{displayTime}</div>
      <div>timer</div>
      <Button
        onClick={() => {
          setTime(900);
          // console.log(dayjs().add(900, "second").format());
          // console.log(dayjs().format());
          const start = dayjs().utc();
          const end = start.add(900, "second");
          setStartTS(start.format());
          setEndTS(end.format());
        }}
      >
        15 min
      </Button>

      <Button
        onClick={() => {
          setTimerRunning((prev) => !prev);
          setEndTS(dayjs().utc().add(time, "seconds").format());
        }}
      >
        {timerRunning ? "pause" : "start"}
      </Button>
    </div>
  );
};
