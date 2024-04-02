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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { RotateCcw, Settings } from "lucide-react";
import TimerSettings from "./TimerSettings";

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
    timerConfig,
    setTimerConfig,
    timerRunning,
    setTimerRunning,
    secondsRemaining,
    setSecondsRemaining,
    displayTimer,
    startTS,
    setStartTS,
    endTS,
    setEndTS,
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
      {/* drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] */}
      <div className="min-w-full rounded-lg border p-6 shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]">
        <div className=" rounded-md bg-gradient-to-tr from-sky-300 to-purple-300 px-5 py-10 text-center text-white">
          {/* <div className="flex items-center justify-between border border-red-400"> */}
          <div>
            {/* <div>start timestamp: {startTS}</div>
              <div>end timestamp: {endTS}</div>
              <div>{secondsRemaining}</div> */}
            <p className="text-8xl sm:text-9xl ">{displayTimer}</p>
          </div>
          {/* <div className="w-1/4">
              <p>num timers {timerState.timersComplete}</p>
              {mode}
            </div> */}
          {/* </div> */}
        </div>
        <div className="my-2 flex flex-col items-center justify-center gap-2">
          <div className=" flex flex-row gap-2">
            Timer Settings:{" "}
            {new Date(timerConfig.timer * 1000)
              .toISOString()
              .substring(timerConfig.timer < 3600 ? 14 : 12, 19)}
            {/* {buttons.map((button) => {
              return (
                <Button
                  // className="outline"
                  variant="outline"
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
            })} */}
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button
              variant="ghost"
              className=""
              onClick={() => {
                setTimerRunning(false);
                setSecondsRemaining(timerConfig.timer);
              }}
              size="icon"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button
              className="w-20"
              variant={timerRunning ? "outline" : "default"}
              onClick={() => {
                setTimerRunning((prev) => !prev);
                setStartTS(dayjs().utc().format());
                setEndTS(
                  dayjs().utc().add(secondsRemaining, "seconds").format(),
                );
                let endTimestamp = dayjs()
                  .utc()
                  .add(secondsRemaining, "seconds")
                  .format();
              }}
            >
              {timerRunning ? "Pause" : "Start"}
            </Button>
            <TimerSettings
              timerConfig={timerConfig}
              setTimerConfig={setTimerConfig}
              setTimerRunning={setTimerRunning}
            />
          </div>
        </div>
      </div>
    </>
  );
};
