import { Timer } from "@/components/Timer";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" flex min-h-screen flex-col items-center p-24">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
      <div className="mb-6 text-center">
        <h1 className="mb-4 mt-4 text-5xl font-semibold tracking-[-1.2px] sm:text-7xl sm:leading-[72px]">
          Focus in parallel with{" "}
          <span className=" bg-gradient-to-tr from-sky-400 to-purple-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-purple-300">
            Pomsly
          </span>
          {/* Co-Work with others */}
          {/* <Image
            src="/assets/logos/logo1_nobg.png"
            alt="Pomsly logo"
            width={55}
            height={55}
            className="mx-2 mb-2 inline"
          /> */}
        </h1>
        <p className="text-md text-slate-300 sm:text-xl">
          A live Co-working Platform to enhance your productivity,
          colaboratively or independently.
        </p>
      </div>
      <TodoTable columns={columns} data={data} />
      <Timer />
      {/* </div> */}
    </main>
  );
}
