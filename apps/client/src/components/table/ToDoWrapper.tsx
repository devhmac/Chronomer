"use client";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

import { taskContext } from "@/providers/TaskContext";
import { ListTodo } from "lucide-react";

import { cn } from "@/lib/utils/utils";
import TaskTable from "./TaskTable";
import { Button } from "../ui/button";

const ToDoWrapper = ({ className }: { className?: string }) => {
  const { tasks, setTasks, tableLoading } = useContext(taskContext);
  const [isOpen, setIsOpen] = useState(true);
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 1, x: "-98%" },
  };

  return (
    <div className="h-full items-center xl:flex">
      <motion.div
        className={cn(
          "scrollbar-thumb-green scrollbar-thumb-rounded scrollbar-track-green-lighter scrollbar-w-2 scrolling-touch h-grow h-full overflow-auto rounded-lg border p-3 shadow-md backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]",
          " transition-all duration-1000 ",
          // isOpen ? "-left-80 w-80" : "left-0 w-80",
        )}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
      >
        <h2 className="mb-2 text-2xl">
          <ListTodo className="mb-[3px] mr-1 inline h-7 w-7" />
          Tasks
        </h2>
        <div className="w-[700px] flex-grow @container">
          <TaskTable data={tasks} tableLoading={tableLoading} />
        </div>
      </motion.div>
      <button
        className="hidden  transform xl:contents"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        button
      </button>
    </div>
  );
};

export default ToDoWrapper;
