"use client";
import React, { useContext, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { taskContext } from "@/providers/TaskContext";
import { ListTodo } from "lucide-react";

import { cn, derivePercentComplete, minutesToTime } from "@/lib/utils/utils";
import TaskTable from "./TaskTable";
import { Button } from "../ui/button";
import { Task } from "@/lib/types/types";

const ToDoWrapper = ({ className }: { className?: string }) => {
  const { tasks, setTasks, tableLoading, setTaskActive, activeTask } =
    useContext(taskContext);

  const totalTimeEstimate = useMemo(() => {
    if (tasks?.length === 0) return { time: 0, string: null };

    const time = tasks
      // .filter((task) => !task.isComplete)
      .reduce((acc, { timeToComplete }) => acc + timeToComplete, 0);
    return { time, string: minutesToTime(time) };
  }, [tasks]);
  const totalTimeSpent = useMemo(() => {
    if (tasks?.length === 0) return { time: 0, string: null };
    const time = tasks
      // .filter((task) => !task.isComplete)
      .reduce((acc, { timeSpent }) => acc + timeSpent, 0);
    return { time, string: minutesToTime(time) };
  }, [tasks]);

  const percentComplete = derivePercentComplete(
    totalTimeSpent.time,
    totalTimeEstimate.time,
  );

  const [isOpen, setIsOpen] = useState(true);
  const variants = {
    open: { opacity: 1, x: 0, display: "block" },
    closed: {
      opacity: 1,
      x: "-98%",
      width: 1,
      // transitionEnd: { display: "none" },
      // display: "none",
      // width: 0,
    },
  };

  return (
    <div className="sm:w-none h-full items-center xl:flex">
      {
        <motion.div
          className={cn(
            "scrollbar-thumb-color scrollbar-thumb-rounded scrollbar-track-color-lighter scrollbar-w-2 scrolling-touch h-grow h-full overflow-auto rounded-lg border p-3 shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]",
            className,

            isOpen ? "" : "",
          )}
          // initial={{ width: 0 }}
          // animate={{ width: 300 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          animate={isOpen ? "open" : "closed"}
          variants={variants}
        >
          <div className="flex items-end justify-between">
            <h2 className="mb-2 text-2xl">
              <ListTodo className="mb-[3px] mr-1 inline h-7 w-7" />
              Tasks
            </h2>
            <p>
              {totalTimeSpent.string ?? "--"} /{" "}
              {totalTimeEstimate.string ?? "--"}
              {!totalTimeSpent.time && !totalTimeEstimate.time
                ? null
                : ` - ${percentComplete} %`}
            </p>
          </div>
          <div className=" md:w-[650px] ">
            <TaskTable
              data={tasks}
              tableLoading={tableLoading}
              setTaskActive={setTaskActive}
              activeTaskId={activeTask?.id ? activeTask.id : undefined}
            />
          </div>
        </motion.div>
      }
      {/* border */}
      {/* {!isOpen && (
        <div className="h-full w-4 rounded-r-lg  border shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none"></div>
      )} */}
      {/* <button
        className="hidden  transform xl:contents"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        button
      </button> */}
    </div>
  );
};

export default ToDoWrapper;
