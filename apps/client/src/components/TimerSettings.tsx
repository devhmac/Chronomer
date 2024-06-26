import React, { Dispatch, SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils/utils";

type props = {
  timerConfig: {
    timer: number;
    rest: number;
    isPomodoro: boolean;
    mode: "timer" | "rest";
  };
  setTimerConfig: Dispatch<
    SetStateAction<{
      timer: number;
      rest: number;
      isPomodoro: boolean;
      mode: "timer" | "rest";
    }>
  >;
  setTimerRunning: Dispatch<SetStateAction<boolean>>;
  setFocusRest: (mode: "timer" | "rest") => void;
};

const TimerSettings = ({
  timerConfig,
  setTimerConfig,
  setTimerRunning,
  setFocusRest,
}: props) => {
  const openAccordion = "item-1";

  const customTimes = [
    { text: "5 sec", val: 5 },
    { text: "15 Min", val: 900 },
    { text: "25 Min", val: 1500 },
    { text: "45 Min", val: 2700 },
    { text: "1 Hr", val: 3600 },
    { text: "1 Hr 30 Min", val: 5400 },
  ];
  const customRests = [
    { text: "5 min", val: 300 },
    { text: "10 Min", val: 600 },
    { text: "25 Min", val: 1500 },
  ];

  const setTimerVars = (
    timer: { text: string; val: number },
    type: "timer" | "rest",
  ) => {
    setTimerRunning(false);
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
        <div
          className={cn(" mb-2 flex items-center justify-around border-b pb-2")}
        >
          <Button
            className={timerConfig.isPomodoro ? "bg-accent" : ""}
            variant="outline"
            onClick={() => {
              // sets config to pomodoro mode
              // setOpen("");
              setTimerConfig((prev) => ({
                ...prev,
                timer: 1500,
                rest: 300,
                isPomodoro: true,
              }));
            }}
          >
            Pomodoro
          </Button>
          <Switch
            onClick={() => {
              // sould try to DRY this switch statment amd buttons
              return setTimerConfig((prev) =>
                prev.isPomodoro === false
                  ? { ...prev, timer: 1500, rest: 300, isPomodoro: true }
                  : { ...prev, isPomodoro: false },
              );
            }}
            checked={!timerConfig.isPomodoro}
          />
          <Button
            className={!timerConfig.isPomodoro ? "bg-accent" : ""}
            variant="outline"
            onClick={() => {
              // setOpen("item-1");
              setTimerConfig((prev) => ({ ...prev, isPomodoro: false }));
            }}
          >
            Custom
          </Button>
        </div>

        <Accordion type="single" collapsible value="item-1">
          <AccordionItem value={openAccordion} className="border-b-0">
            {/* <AccordionTrigger className=" "></AccordionTrigger> */}
            <AccordionContent className="ml-3 flex flex-wrap gap-1 ">
              <div className="border-b">
                {/* setting focus timer settings */}
                <p className="font-medium ">Timer Length:</p>
                {customTimes.map((button) => {
                  return (
                    <Button
                      key={button.text}
                      onClick={() => {
                        setTimerVars(button, "timer");
                        setFocusRest("timer");
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
              </div>
              <div>
                {/* setting rest mode settings */}
                <p>Rest Length:</p>
                {customRests.map((button) => {
                  return (
                    <Button
                      key={button.text}
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
