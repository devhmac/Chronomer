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
import {
  Hourglass,
  MoonStar,
  RotateCcw,
  Settings,
  TimerReset,
  Clock,
} from "lucide-react";
import TimerSettings from "./TimerSettings";
import { cn } from "@/lib/utils";

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
      <div className="w-1/3 min-w-full rounded-lg border p-6  shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]">
        <div
          className={cn(
            "relative rounded-md bg-gradient-to-tr from-sky-300 to-purple-300 px-5 py-12 text-center  text-white",
          )}
        >
          {/* <div className="flex items-center justify-between border border-red-400"> */}
          <div>
            <p className=" overflow-clip text-7xl sm:text-9xl ">
              {displayTimer}
            </p>
          </div>
          <div className="absolute bottom-2 left-0 right-0  mx-2 flex flex-row items-center justify-between align-middle">
            <p>{timerConfig.mode === "rest" ? "Rest" : "Focus"}</p>
            <span>
              <span className="mx-1">
                <Clock className="inline-block h-5 w-5 align-middle" />:{" "}
                {timerState.timersComplete}
              </span>
              <span className="mx-1">
                <MoonStar className="inline-block h-5 w-5 align-middle" />:{" "}
                {timerState.restsComplete}
              </span>
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-between gap-2 ">
          <div className="bottom-1 flex  flex-row items-center justify-center gap-2  ">
            <Button
              variant="ghost"
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
          {/* removed timer settings thing, dont love it put it in a tooltip */}
          {/* <div className=" flex w-1/4 flex-col items-end justify-end gap-2">
            <div>
              <p className="">
                {timerConfig.isPomodoro ? "Pomodoro" : "Custom"}
              </p>
              <p>
                Timer:{" "}
                {new Date(timerConfig.timer * 1000)
                  .toISOString()
                  .substring(timerConfig.timer < 3600 ? 14 : 12, 19)}
              </p>
              <p>
                Rest:{" "}
                {new Date(timerConfig.rest * 1000)
                  .toISOString()
                  .substring(timerConfig.rest < 3600 ? 14 : 12, 19)}
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
