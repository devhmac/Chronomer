"use client";

import { normalizeNodeId, type Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

import { EditorKit } from "@/components/editor/editor-kit";
import { SettingsDialog } from "@/components/editor/settings-dialog";
import { Editor, EditorContainer } from "@/components/ui/editor";

interface TextEditorProps {
  content?: Value;
}

export function PlateEditor({ content }: TextEditorProps) {
  const value = content;
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}
