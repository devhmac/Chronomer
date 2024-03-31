import { Timer } from "@/components/Timer";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";
import Header from "@/components/Header";
import { Butterfly_Kids } from "next/font/google";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className=" min-h-screen p-10 text-center">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
      <Header />

      <div className="w-100%  h-100% flex  flex-row items-center ">
        <div className="">
          <TodoTable columns={columns} data={data} />
        </div>
        <Timer />
      </div>
      <Button className="hover:accent/50 bg-popover/50" variant="outline">
        Create Live Space
      </Button>
    </main>
  );
}
