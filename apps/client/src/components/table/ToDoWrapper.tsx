"use client";
import React, { useContext } from "react";
import { DataTable } from "./DataTable";
import { columns } from "@/components/table/columns";
import { taskContext } from "@/providers/TaskContext";
import { ListTodo } from "lucide-react";
import TableSkeleton from "./skeleton/TableSkeleton";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

const ToDoWrapper = () => {
  const { tasks, setTasks, tableLoading } = useContext(taskContext);

  return (
    <div className="rounded-lg border p-3 shadow backdrop-blur dark:border-[rgba(255,255,255,0.3)] dark:bg-accent/25 dark:backdrop-blur-none sm:min-w-[540px]">
      <h2
        className="mb-2 text-2xl font-medium
     tracking-tight"
      >
        <ListTodo className="mb-[3px] inline h-7 w-7" />
        Tasks
      </h2>
      <TableSkeleton />

      {false ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={tasks}
          setData={setTasks}
          tableLoading={tableLoading}
        />
      )}
    </div>
  );
};

export default ToDoWrapper;
