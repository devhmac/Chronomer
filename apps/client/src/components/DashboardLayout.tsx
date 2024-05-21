import React from "react";

import { Timer } from "./Timer";
import Chat from "./chat/Chat";
import { columns } from "@/components/table/columns";
import ToDoWrapper from "./table/ToDoWrapper";
import ActiveTask from "./ActiveTask";

const DashboardLayout = () => {
  return (
    <div className="xl:h-screen">
      {/* flexbox version */}
      <div className="relative flex h-full flex-col-reverse flex-wrap-reverse items-center justify-center gap-2 xl:flex-row  ">
        {/* grid version */}
        {/* <div className="grid grid-cols-3 gap-2 pt-[61px] text-center"> */}
        {/* <div className=""> */}
        {/* <div className="min-w-[300px]"> */}
        {/* <TodoTable columns={columns} data={data} /> */}
        <div className="w-full sm:w-auto xl:h-full xl:pt-[61px]">
          <ToDoWrapper className="xl:border-l-0" />
        </div>
        <div className="mx-auto w-full max-w-[560px] pt-[61px] sm:w-fit xl:pt-0">
          <ActiveTask />
          <Timer className={"mb-2 shadow-lg dark:shadow-indigo-300/10"} />
        </div>
        {/* <div className="- h-full w-[600px] border border-red-200">
            <p>this is chat</p>
          </div> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
