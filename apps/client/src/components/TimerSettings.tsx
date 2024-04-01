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
  timerSelected: number;
  setTimerSelected: Dispatch<SetStateAction<number>>;
  setTimerRunning: Dispatch<SetStateAction<boolean>>;
  setSecondsRemaining: Dispatch<SetStateAction<number>>;
};

const TimerSettings = ({
  timerSelected,
  setTimerSelected,
  setTimerRunning,
  setSecondsRemaining,
}: props) => {
  const customRests = [];
  const customTimes = [
    { text: "5 sec", val: 5 },
    { text: "15 Min", val: 900 },
    { text: "25 Min", val: 1500 },
    { text: "45 Min", val: 2700 },
    { text: "1 Hr", val: 3600 },
  ];

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
                <p className="font-medium underline underline-offset-4">
                  Timer Length:
                </p>
                {customTimes.map((button) => {
                  return (
                    <Button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSelected(button.val);
                        setSecondsRemaining(button.val);
                      }}
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
                <Button>5min</Button>
                <Button>10min</Button>
                <Button>15min</Button>
                <Button>25min</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  );
};

export default TimerSettings;
