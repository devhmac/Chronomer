import React, { Dispatch, SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

type props = {
  timerConfig: { timer: number; rest: number; isPomodoro: boolean };
  setTimerConfig: Dispatch<
    SetStateAction<{ timer: number; rest: number; isPomodoro: boolean }>
  >;
  setTimerRunning: Dispatch<SetStateAction<boolean>>;
  setSecondsRemaining: Dispatch<SetStateAction<number>>;
};

const TimerSettings = ({
  timerConfig,
  setTimerConfig,
  setTimerRunning,
  setSecondsRemaining,
}: props) => {
  const customTimes = [
    { text: "5 sec", val: 5 },
    { text: "15 Min", val: 900 },
    { text: "25 Min", val: 1500 },
    { text: "45 Min", val: 2700 },
    { text: "1 Hr", val: 3600 },
  ];
  const customRests = [
    { text: "5 min", val: 30 },
    { text: "10 Min", val: 600 },
    { text: "25 Min", val: 1500 },
  ];

  const setTimerVars = (
    timer: { text: string; val: number },
    type: "timer" | "rest",
  ) => {
    setTimerRunning(false);
    if (type === "timer") {
      setSecondsRemaining(timer.val);
    }
    setTimerConfig((prev) =>
      type === "rest"
        ? { ...prev, rest: timer.val, isPomodoro: false }
        : { ...prev, timer: timer.val, isPomodoro: false },
    );
  };

  return (
    <Popover>
      <PopoverTrigger className="h-10 w-10 rounded-md hover:border hover:bg-accent">
        <Settings className="m-auto h-6 w-6 hover:bg-accent" />
      </PopoverTrigger>
      <PopoverContent>
        <Button variant="ghost">Pomodoro</Button>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-2">
            <AccordionTrigger>Pomodoro</AccordionTrigger>
            {/* <AccordionContent className="ml-3 flex flex-wrap gap-1"></AccordionContent> */}
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>Custom</AccordionTrigger>
            <AccordionContent className="ml-3 flex flex-wrap gap-1">
              <div className="">
                <p className="font-medium ">Timer Length:</p>
                {customTimes.map((button) => {
                  return (
                    <Button
                      onClick={() => {
                        setTimerVars(button, "timer");
                      }}
                      className={`w-13 m-1 gap-1  ${
                        button.val === timerConfig.timer
                          ? "bg-secondary"
                          : "bg-popover"
                      }`}
                      variant="ghost"
                      size="sm"
                    >
                      {button.text}
                    </Button>
                  );
                })}
                {/* <Button variant="ghost">10min</Button> */}
                {/* <Button>25min</Button> */}
                {/* <Button>45min</Button> */}
                {/* <Button>1hr</Button> */}
              </div>
              <div>
                <p>Rest Length:</p>
                {customRests.map((button) => {
                  return (
                    <Button
                      onClick={() => {
                        setTimerVars(button, "rest");
                      }}
                      className={`w-13 m-1 gap-1  ${
                        button.val === timerConfig.rest
                          ? "bg-secondary"
                          : "bg-popover"
                      }`}
                      variant="ghost"
                      size="sm"
                    >
                      {button.text}
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  );
};

export default TimerSettings;
