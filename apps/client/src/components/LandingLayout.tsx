import Header from "@/components/Header";
import { TodoTable } from "./table/TodoTable";
import { Button } from "./ui/button";
import { Timer } from "./Timer";
import { Payment, columns } from "@/components/table/columns";
import { data } from "@/components/table/sample_data";
import MaxWidthWrapper from "./MaxWidthWrapper";

const LandingLayout = () => {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"> */}
      <Header />

      <Timer />
      <div className="">
        <TodoTable columns={columns} data={data} />
      </div>
      <Button className="hover:accent/50 bg-popover/50" variant="outline">
        Create Live Space
      </Button>
    </MaxWidthWrapper>
  );
};

export default LandingLayout;
