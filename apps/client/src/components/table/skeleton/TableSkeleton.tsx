import { Skeleton, SVGSkeleton } from "./Skeleton";

const TableSkeleton = () => (
  <>
    <div className="border backdrop-blur-sm">
      <div className="relative w-full overflow-auto">
        <tbody className="[&amp;_tr:last-child]:border-0">
          <tr className="border-b transition-colors">
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div>
                <div>
                  <SVGSkeleton className="h-[24px] w-[24px]" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="text-left">
                <div className="border-input p-2 hover:border">
                  <Skeleton className="w-[88px] max-w-full" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="[&amp;>span]:line-clamp-1 mr-1 flex h-10 w-full items-center justify-between border border-none border-input px-3 py-2">
                <span>
                  <Skeleton className="w-[56px] max-w-full" />
                </span>
                <SVGSkeleton className="h-[24px] w-[24px]" />
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div>
                <div>
                  <SVGSkeleton className="h-[24px] w-[24px]" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="text-left">
                <div className="border-input p-2 hover:border">
                  <Skeleton className="w-[88px] max-w-full" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="[&amp;>span]:line-clamp-1 mr-1 flex h-10 w-full items-center justify-between border border-none border-input px-3 py-2">
                <span>
                  <Skeleton className="w-[56px] max-w-full" />
                </span>
                <SVGSkeleton className="h-[24px] w-[24px]" />
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div>
                <div>
                  <SVGSkeleton className="h-[24px] w-[24px]" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="text-left">
                <div className="border-input p-2 hover:border">
                  <Skeleton className="w-[104px] max-w-full" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="[&amp;>span]:line-clamp-1 mr-1 flex h-10 w-full items-center justify-between border border-none border-input px-3 py-2">
                <span>
                  <Skeleton className="w-[56px] max-w-full" />
                </span>
                <SVGSkeleton className="h-[24px] w-[24px]" />
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div>
                <div>
                  <SVGSkeleton className="h-[24px] w-[24px]" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="text-left">
                <div className="border-input p-2 hover:border">
                  <Skeleton className="w-[176px] max-w-full" />
                </div>
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle">
              <div className="[&amp;>span]:line-clamp-1 mr-1 flex h-10 w-full items-center justify-between border border-none border-input px-3 py-2">
                <span>
                  <Skeleton className="w-[56px] max-w-full" />
                </span>
                <SVGSkeleton className="h-[24px] w-[24px]" />
              </div>
            </td>
            <td className="[&amp;:has([role=checkbox])]:pr-0 px-3 py-1 align-middle"></td>
          </tr>
        </tbody>
      </div>
    </div>
  </>
);

export default TableSkeleton;
