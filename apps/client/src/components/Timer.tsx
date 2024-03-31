"use client";

import { useEffect, useState, useContext } from "react";
import { Button } from "./ui/button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useTimer } from "@/lib/hooks/useTimer";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
import { timerContext } from "@/context/TimerContext";

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

// if pomodoro selected, build array of pomodoro order
export const Timer = () => {
  const { timerState, setTimerState, isRunning, setIsRunning } =
    useContext(timerContext);
  const pomOrder = [];
  const timeMap = { shortBreak: 300, longBreak: 1200 };

  const {
    timerSelected,
    setTimerSelected,
    timerRunning,
    setTimerRunning,
    secondsRemaining,
    setSecondsRemaining,
    displayTimer,
    startTS,
    setStartTS,
    endTS,
    setEndTS,
    mode,
  } = useTimer();

  const seconds = 10;

  const buttons = [
    { text: "5 sec", val: 5 },

    { text: "15 Min", val: 900 },
    { text: "25 Min", val: 1500 },
  ];

  return (
    <>
      {/* this was the bg and border before border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.2)] */}
      <div className="bg-muted/1 mx-auto w-1/2 rounded-lg border border-[rgba(255,255,255,0.3)] bg-popover/25 p-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        <div className="mb-3 flex justify-center gap-3">
          <Button>Pomodoro</Button>
          <Button>Custom</Button>
        </div>
        <div className="dark rounded-md bg-gradient-to-tr from-sky-300 to-purple-300 p-5 text-center text-white ">
          <div>start timestamp: {startTS}</div>
          <div>end timestamp: {endTS}</div>
          <div>{secondsRemaining}</div>
          <p className=" my-5 text-8xl">{displayTimer}</p>

          <div className="my-2 flex justify-center gap-2">
            {buttons.map((button) => {
              return (
                <Button
                  key={button.text}
                  onClick={() => {
                    // console.log(dayjs().add(900, "second").format());
                    // console.log(dayjs().format());
                    setTimerRunning(false);
                    setTimerSelected(button.val);
                    setSecondsRemaining(button.val);
                    const start = dayjs().utc();
                    const end = start.add(button.val, "second");
                    setStartTS(start.format());
                    setEndTS(end.format());
                  }}
                >
                  {button.text}
                </Button>
              );
            })}
          </div>
          <Button
            className="dark"
            variant={timerRunning ? "outline" : "default"}
            onClick={() => {
              setTimerRunning((prev) => !prev);
              setStartTS(dayjs().utc().format());
              setEndTS(dayjs().utc().add(secondsRemaining, "seconds").format());
            }}
          >
            {timerRunning ? "Pause" : "Start"}
          </Button>
        </div>
        <p>num timers {timerState.timersComplete}</p>
        {mode}
      </div>
    </>
  );
};
