"use client";

import { useState, useContext } from "react";

import { Button } from "./ui/button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useTimer } from "@/lib/hooks/useTimer";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
import { timerContext } from "@/providers/TimerContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MoonStar, RotateCcw, Settings, TimerReset, Clock } from "lucide-react";
import TimerSettings from "./TimerSettings";
import { cn } from "@/lib/utils/utils";
import MuteUnmute from "./MuteUnmute";

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
export const Timer = ({ className }: { className?: string }) => {
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
    audioRef,
    timerActions,
  } = useTimer();

  const [isMuted, setIsMuted] = useState(false);

  return (
    <>
      {/* this was the bg and border before border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.2)] */}
      {/* drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] */}
      <div
        className={cn(
          " min-w-full rounded-lg border p-6  shadow-md backdrop-blur-sm dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[560px]",
          className,
        )}
      >
        <div
          className={cn(
            "relative rounded-md bg-linear-to-tr from-sky-300 to-purple-300 px-5 py-14 text-center text-white transition-all duration-200",
            "relative z-10 overflow-hidden before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-linear-to-tr before:from-purple-500 before:to-purple-300 before:transition-opacity before:duration-300",
            timerConfig.mode === "rest"
              ? "before:opacity-100"
              : "before:opacity-0",
          )}
        >
          {/* <div className="flex items-center justify-between border border-red-400"> */}
          <div>
            <p className=" overflow-clip text-7xl sm:text-9xl ">
              {displayTimer}
            </p>
          </div>
          <div className="absolute bottom-2 left-0 right-0  mx-2 flex flex-row items-center justify-between align-middle">
            <div className="space between flex">
              <MuteUnmute isMuted={isMuted} setIsMuted={setIsMuted} />

              <Button
                variant="ghost"
                size="sm"
                className="mb-0"
                onClick={timerActions.toggleFocusRest}
              >
                {timerConfig.mode === "rest" ? (
                  <>
                    <MoonStar className="h-5 w-5 pr-1" />
                    Rest
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 pr-1 " />
                    Focus
                  </>
                )}
              </Button>
            </div>
            <span className="">
              <span className="mx-1 ">
                <Clock className="inline h-5 w-5 " />:{" "}
                <span className=" h-5 w-5 align-middle">
                  {timerState.timersComplete}
                </span>
              </span>
              <span className="mx-1">
                <MoonStar className="inline h-5 w-5 " />:{" "}
                <span className="h-5 w-5 align-middle">
                  {timerState.restsComplete}
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-between gap-2 ">
          {/* break this into separate components */}

          {/* timer reset */}
          <div className="bottom-1 flex  flex-row items-center justify-center gap-2  ">
            <Button
              variant="ghost"
              className=""
              onClick={timerActions.resetTimer}
              size="icon"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>

            {/* timer start */}
            <Button
              className="w-20"
              variant={timerRunning ? "outline-solid" : "default"}
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
              setFocusRest={timerActions.setFocusRest}
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={"/audio.mp3"} muted={isMuted} />
    </>
  );
};
