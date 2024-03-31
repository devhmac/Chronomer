import { Timer } from "@/components/Timer";
import Chat from "@/components/chat/Chat";
import { TodoTable } from "@/components/table/TodoTable";
import React from "react";

const page = () => {
  return (
    <main>
      <TodoTable columns={[]} data={[]} />
      <Timer />
      <Chat />
    </main>
  );
};

export default page;
