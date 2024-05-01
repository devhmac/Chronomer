import React from "react";

import { Timer } from "./Timer";
import Chat from "./chat/Chat";
import { columns } from "@/components/table/columns";
import ToDoWrapper from "./table/ToDoWrapper";

const DashboardLayout = () => {
  return (
    <>
      <div className="h-screen ">
        {/* flexbox version */}
        <div className="relative flex h-full flex-row flex-wrap-reverse items-center gap-2 ">
          {/* grid version */}
          {/* <div className="grid grid-cols-3 gap-2 pt-[61px] text-center"> */}
          {/* <div className=""> */}
          {/* <div className="min-w-[300px]"> */}
          {/* <TodoTable columns={columns} data={data} /> */}
          <div className="h-full pt-[61px]">
            <ToDoWrapper className="border-l-0" />
          </div>

          <div className="mx-auto">
            <Timer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
