import {
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  Dispatch,
} from "react";

type Timer = {
  time: number;
  rest: number;
  lastTimerSelected: number | undefined;
  startTS: Date | undefined;
  endTS: Date | undefined;
  timersComplete: number;
  restsComplete: number;
  timerType: "POMODORO" | "CUSTOM";
  currentMode: "TIMER" | "REST";
};

type TimerContext{
  timerState: Timer,
  setTimerState: Dispatch<SetStateAction<Timer>>,

}

const defaultTimerState = {
  timerState:{

    time: 1500,
    rest: 300,
    lastTimerSelected: undefined,
    startTS: undefined,
    endTS: undefined,
    currentMode: "TIMER",
    timerType: "POMODORO",
    timersComplete: 0,
    restsComplete: 0,
  } as Timer,
  setTimerState:()=>{}
}



const timerContext = createContext<TimerContext>(defaultTimerState);

export const TimerContextProvider = ({ children }: { children: ReactNode }) => {
  const [timerState, setTimerState] = useState<Timer>(defaultTimerState.timerState);
  
  return <timerContext.Provider value={{ timerState, setTimerState }}>{children}</timerContext.Provider>;
};
