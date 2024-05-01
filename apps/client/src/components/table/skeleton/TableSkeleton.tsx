import { Skeleton, SVGSkeleton } from "./Skeleton";
// import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => (
  // <div className="border backdrop-blur-sm">
  //   <div className="relative w-full overflow-auto">
  <tbody className="border-0 ">
    {Array.from({ length: 4 }).map((item, index) => (
      <tr key={index} className="border-b transition-colors">
        <td className=" px-2 py-1 align-middle">
          <div>
            <div>
              <SVGSkeleton className="h-[24px] w-[24px]" />
            </div>
          </div>
        </td>
        <td className=" w-full px-3 py-1 align-middle">
          <div className="text-left">
            <div className="p-2 ">
              <Skeleton className="w-full max-w-full" />
            </div>
          </div>
        </td>
        <td className="px-3 py-1 align-middle">
          <div className="text-left">
            <div className="p-2 ">
              <Skeleton className="w-full max-w-full" />
            </div>
          </div>
        </td>
        <td className="px-3 py-1 align-middle">
          <div className="text-left">
            <div className=" p-2 ">
              <Skeleton className="w-full " />
            </div>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
  //   </div>
  // </div>
);

export default TableSkeleton;
