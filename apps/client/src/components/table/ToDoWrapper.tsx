"use client";
import React, { useContext, useState } from "react";
import { TodoTable } from "./TodoTable";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { taskContext } from "@/context/TaskContext";
const ToDoWrapper = () => {
  const [todos, setTodos] = useState(data);

  const { tasks, addTask } = useContext(taskContext);

  return (
    <div>
      <TodoTable columns={columns} data={todos} setData={setTodos} />
    </div>
  );
};

export default ToDoWrapper;
