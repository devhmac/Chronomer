"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Editor, Tldraw, toRichText } from "tldraw";

import "tldraw/tldraw.css";

export default function CanvasPage() {
  const handleMount = (editor: Editor) => {
    // editor.createShape({
    //   type: "text",
    //   x: 10,
    //   y: 10,
    //   props: {
    //     richText: toRichText("Fresh canvas"),
    //   },
    // });
    // editor.selectAll();
    // editor.zoomToSelection({
    //   animation: { duration: 5000 },
    // });
  };

  return (
    <main>
      <MaxWidthWrapper>
        <div className="pt-14" style={{ position: "fixed", inset: 0 }}>
          <Tldraw onMount={handleMount} />
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
