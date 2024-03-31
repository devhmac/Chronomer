import React from "react";
import { TodoTable } from "./table/TodoTable";
import { Timer } from "./Timer";
import Chat from "./chat/Chat";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen flex-row items-center">
      <TodoTable columns={[]} data={[]} />
      <Timer />
      <Chat />
    </div>
  );
};

export default DashboardLayout;
