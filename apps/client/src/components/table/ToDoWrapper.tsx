"use client";
import React, { useState } from "react";
import { TodoTable } from "./TodoTable";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
const ToDoWrapper = () => {
  const [todos, setTodos] = useState(data);
  return (
    <div>
      <TodoTable columns={columns} data={todos} setData={setTodos} />
    </div>
  );
};

export default ToDoWrapper;
