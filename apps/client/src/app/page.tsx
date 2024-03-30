import { Timer } from "@/components/Timer";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" flex min-h-screen flex-col items-center p-24">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
      <TodoTable columns={columns} data={data} />
      <div className="mb-4 text-center">
        <h1 className="mt-4 text-4xl font-semibold tracking-[-1.2px] sm:text-6xl sm:leading-[72px]">
          Focus in parallel with Pomsly
          {/* Co-Work with others */}
        </h1>
        <p className="text-slate-400">
          A Live Co-Working Platform to do something with others blab blab blah
        </p>
      </div>
      <Timer />
      {/* </div> */}
    </main>
  );
}
