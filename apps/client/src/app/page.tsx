import { Timer } from "@/components/Timer";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
      <TodoTable columns={columns} data={data} />
      <Timer />
      {/* </div> */}
    </main>
  );
}
