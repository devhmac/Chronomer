"use client";
import { NOTES_LOCAL_STORE_KEY } from "@/components/editor/plate-editor";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Editor, getSnapshot, Tldraw, toRichText } from "tldraw";

import "tldraw/tldraw.css";

export default function CanvasPage() {
  const handleMount = (editor: Editor) => {
    if (typeof window === "undefined") return;
    const savedValue = localStorage.getItem(NOTES_LOCAL_STORE_KEY);
    const content = savedValue ? JSON.parse(savedValue) : null;

    console.log("rich text", toRichText("hello world"));

    console.log("notes text", content);

    if (!content) return;
    editor.createShape({
      type: "text",
      x: 10,
      y: 10,

      props: {
        // text: "helo",
        // richText: content,
      },
    });
    editor.selectAll();
    editor.zoomToSelection({
      animation: { duration: 5000 },
    });

    console.log("canvas snapshot", getSnapshot(editor.store));
  };

  return (
    <main>
      <MaxWidthWrapper>
        <div className="pt-14" style={{ position: "fixed", inset: 0 }}>
          <Tldraw onMount={handleMount} persistenceKey="example" />
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
