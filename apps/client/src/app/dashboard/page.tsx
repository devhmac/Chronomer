import DashboardLayout from "@/components/DashboardLayout";
import { Timer } from "@/components/Timer";
import Chat from "@/components/chat/Chat";
import { TodoTable } from "@/components/table/TodoTable";
import React from "react";

const page = () => {
  return (
    <main className="max-h-screen px-8 pt-[61px] ">
      <DashboardLayout />
    </main>
  );
};

export default page;
