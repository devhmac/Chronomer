import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

const TimerSettings = () => {
  const customTimes = [];
  const customRests = [];
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

                <Button variant="ghost">10min</Button>
                <Button>25min</Button>
                <Button>45min</Button>
                <Button>1hr</Button>
              </div>
              <div>
                <p>Rest Length</p>
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
