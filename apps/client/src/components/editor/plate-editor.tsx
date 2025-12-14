"use client";

import { normalizeNodeId, type Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { SettingsDialog } from "@/components/editor/settings-dialog";
import { Editor, EditorContainer } from "@/components/ui/editor";

interface TextEditorProps {
  content?: Value;
}
export const NOTES_LOCAL_STORE_KEY = "demo-notes";

export function PlateEditor({ content }: TextEditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => {
      if (typeof window === "undefined") return;
      const savedValue = localStorage.getItem(NOTES_LOCAL_STORE_KEY);
      return savedValue ? JSON.parse(savedValue) : null;
    },
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        console.log(value);
        localStorage.setItem(NOTES_LOCAL_STORE_KEY, JSON.stringify(value));
      }}
    >
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}
