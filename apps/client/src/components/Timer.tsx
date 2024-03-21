"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { off } from "process";
import { timeStamp } from "console";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export const Timer = () => {
  // new Date(SECONDS * 1000).toISOString().substring(14, 19) //just min & sec

  // at a high level I will need to
  // - timer on or off
  // - time amount
  // - start or end timeStamp
  // - is paused? - no dont think i need this I can just do if time past end date done

  // could also export from custom hook hours, mins, seconds

  // What do i need to know to set a timer with as little info saved as possible
  // --time remaining as of last start button press
  // -- time stamp it should finish? Do i even need this?

  // could do timestamp of last timer start/resume & end timeStamp, or remaining time as of last start/resume begin decrementing if current timestamp is not later than end timestamp

  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTS, setStartTS] = useState<null | string>(null);
  const [endTS, setEndTS] = useState<null | string>(null);
  const [lastTimerSelected, setLastTimerSelected] = useState<null | number>(
    null
  );

  const displayTime = new Date(time * 1000).toISOString().substring(12, 19);
  // const startDT = new Date(Date.now()).toISOString();

  const seconds = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        if (time === 0 || dayjs().isSameOrAfter(endTS)) {
          clearInterval(interval);
          setTimerRunning(false);
          // send notifification
          setTime(lastTimerSelected || 300);
          return;
        }
        setTime((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time, timerRunning]);

  return (
    <>
      <div className="bg-[rgba(255,255,255,0.2)] p-2 rounded-lg border-[rgba(255,255,255,0.2)] border">
        <div className="bg-gradient-to-tr from-sky-300 to-purple-300 p-5 rounded-md">
          <div>start timestamp: {startTS}</div>
          <div>end timestamp: {endTS}</div>
          <div>{time}</div>
          <p className="text-6xl">{displayTime}</p>
          <div>timer</div>
          <Button
            onClick={() => {
              setTime(seconds);
              // console.log(dayjs().add(900, "second").format());
              // console.log(dayjs().format());
              setLastTimerSelected(seconds);
              const start = dayjs().utc();
              const end = start.add(seconds, "second");
              setStartTS(start.format());
              setEndTS(end.format());
            }}
          >
            15 min
          </Button>
          <Button
            className="bg-[rgba(255,255,255,0.4)] text-zinc-600 "
            onClick={() => {
              setTimerRunning((prev) => !prev);
              setEndTS(dayjs().utc().add(time, "seconds").format());
            }}
          >
            {timerRunning ? "pause" : "start"}
          </Button>
        </div>
      </div>
    </>
  );
};
