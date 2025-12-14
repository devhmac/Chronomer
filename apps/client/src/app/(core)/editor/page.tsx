import { PlateEditor } from "@/components/editor/plate-editor";
import { Toaster } from "sonner";

export default function Page() {
  return (
    <div className="bg-background h-screen w-full">
      <PlateEditor />
      <Toaster />
    </div>
  );
}
