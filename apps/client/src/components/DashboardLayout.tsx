import React from "react";
import { TodoTable } from "./table/DataTable";
import { Timer } from "./Timer";
import Chat from "./chat/Chat";
import { columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import ToDoWrapper from "./table/ToDoWrapper";

const DashboardLayout = () => {
  return (
    <>
      {/* flexbox version */}
      <div className="flex h-screen flex-row flex-wrap-reverse items-center justify-center gap-2 pt-[61px] text-center">
        {/* grid version */}
        {/* <div className="grid grid-cols-3 gap-2 pt-[61px] text-center"> */}
        {/* <div className=""> */}
        {/* <div className="min-w-[300px]"> */}
        {/* <TodoTable columns={columns} data={data} /> */}
        <ToDoWrapper />

        <div>
          <Timer />
        </div>
        <div className="min-w-[300px] bg-red-200">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
