import Header from "@/components/Header";
import { Button } from "./ui/button";
import { Timer } from "./Timer";

import MaxWidthWrapper from "./MaxWidthWrapper";
import ToDoWrapper from "./table/ToDoWrapper";

import TableSkeleton from "./table/skeleton/TableSkeleton";
import Link from "next/link";

const LandingLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      <MaxWidthWrapper className="sm:mt-30 mb-6 mt-28 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200/50 bg-popover/25 px-6 py-2 shadow-md backdrop-blur-sm transition-all hover:bg-accent/50">
          <p className="text-sm font-semibold text-primary">v0.5 Now Live!</p>
        </div>
        <Header />
        <div className="mt-5 rounded-lg bg-gradient">
          <Link href="/dashboard">
            <Button className="m-0.5 bg-background text-primary hover:bg-secondary">
              Get Started
            </Button>
          </Link>
        </div>
      </MaxWidthWrapper>

      {/* <Timer className={" shadow-[rgba(165,_180,_252,_0.4)_0px_30px_90px]"} /> */}
      <Timer className={" shadow-xl shadow-indigo-300/40"} />

      <MaxWidthWrapper className="mb-12 mt-20 text-center ">
        <h2 className="sub-header-text mb-6 ">Track your Velocity</h2>
        <p className="landing-sub-text">
          Time based tasks management to organize your workflow and keep you on
          track.
        </p>
      </MaxWidthWrapper>
      <div className="w-full sm:w-auto">
        {/* <ToDoWrapper
          className={"shadow-[rgba(165,_180,_252,_0.4)_0px_30px_90px]"}
        /> */}
        <ToDoWrapper className={"shadow-xl  shadow-indigo-300/40"} />
        {/* really cool echo background */}
        {/* <ToDoWrapper
          className={
            "shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)]"
          }
        /> */}
      </div>

      <div>
        <div>
          <div className="max-w-8xl mx-auto px-6 lg:px-8">
            <div className="mt-16 flow-root sm:mt-24">
              {/* move this into the table component */}
              {/* <div className="border-shadow-2 m-2 rounded-xl p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"></div> */}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        ></div>
      </div>

      <div className=""></div>
      {/* <Button className="hover:accent/50 bg-gradient" variant="outline">
        Start Live Space
      </Button> */}
    </div>
  );
};

export default LandingLayout;
