import { useEffect, useState, useContext } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.extend(isSameOrAfter);
import { timerContext } from "@/context/TimerContext";

export const useTimer = () => {
  const { timerState, setTimerState, isRunning, setIsRunning } =
    useContext(timerContext);
  const pomOrder = [];
  const timeMap = { shortBreak: 300, longBreak: 1200 };

  const [secondsRemaining, setSecondsRemaining] = useState(
    timerState.timerLength,
  );
  const [rest, setRest] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTS, setStartTS] = useState<undefined | string>(undefined);
  const [endTS, setEndTS] = useState<undefined | string>(undefined);
  const [timerSelected, setTimerSelected] = useState<undefined | number>(
    undefined,
  );
  const [mode, setMode] = useState<"TIMER" | "REST">("TIMER");
  const displayTimer = new Date(secondsRemaining * 1000)
    .toISOString()
    .substring(secondsRemaining < 3600 ? 14 : 12, 19);
  // const startDT = new Date(Date.now()).toISOString();

  const seconds = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        if (secondsRemaining === 0 || dayjs().isAfter(endTS)) {
          console.log("inside main stop condition");
          if (secondsRemaining === 0) {
            console.log("inside timer runout stop condition");
            setTimerState((prev) => ({
              ...prev,
              timersComplete: prev.timersComplete + 1,
            }));
            setMode((prev) => (prev === "TIMER" ? "REST" : "TIMER"));
          }
          console.log("timers complete", timerState.timersComplete);
          clearInterval(interval);
          setTimerRunning(false);
          // send notifification
          setSecondsRemaining(timerSelected || 300);
          return;
        }
        setSecondsRemaining((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining, timerRunning]);

  return {
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
  };
};
