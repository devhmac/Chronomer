"use client";
import React, { useContext, useState } from "react";
import { TodoTable } from "./TodoTable";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { taskContext } from "@/context/TaskContext";
import { ListTodo } from "lucide-react";
const ToDoWrapper = () => {
  const [todos, setTodos] = useState(data);

  const { tasks, addTask } = useContext(taskContext);

  return (
    <div className="rounded-lg border p-3 shadow backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none">
      <h2
        className="mb-2 text-2xl font-medium
     tracking-tight"
      >
        {" "}
        <ListTodo className="mb-[3px] inline h-7 w-7" /> Tasks
      </h2>

      <TodoTable columns={columns} data={tasks} setData={setTodos} />
    </div>
  );
};

export default ToDoWrapper;
