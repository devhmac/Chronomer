"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Tldraw, toRichText } from "tldraw";

import "tldraw/tldraw.css";

export default function CanvasPage() {
  const handleMount = (editor) => {
    editor.createShape({
      type: "text",
      x: 200,
      y: 200,
      props: {
        richText: toRichText("Hello world!"),
      },
    });

    editor.selectAll();

    editor.zoomToSelection({
      animation: { duration: 5000 },
    });
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
