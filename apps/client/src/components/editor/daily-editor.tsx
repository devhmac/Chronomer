"use client";

import { useCallback, useRef } from "react";
import { type Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { ulid } from "ulid";

import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { NOTE_BLOCK_TYPE } from '@/components/editor/plugins/note-block-kit';
import { TAG_TYPE } from '@/components/editor/plugins/tag-kit';
import { useNotesStore, type NoteBlockData } from "@/stores/notes-store";

interface DailyEditorProps {
  date: string; // YYYY-MM-DD
}

/**
 * Build the initial Plate value from blocks in the store for a given date.
 * Each block becomes a note-block wrapper node containing its content children.
 */
function buildEditorValue(date: string): Value {
  const blocks = useNotesStore.getState().getBlocksByDate(date);

  if (blocks.length === 0) {
    const blockId = ulid();
    return [
      {
        type: NOTE_BLOCK_TYPE,
        id: blockId,
        tags: [] as string[],
        children: [{ type: "p", children: [{ text: "" }], id: blockId + "_p" }],
      },
    ];
  }

  return blocks.map((block) => ({
    type: NOTE_BLOCK_TYPE,
    id: block.id,
    tags: block.tags,
    children: block.content as any[],
  }));
}

/**
 * Extract NoteBlockData from the current editor value.
 * Walks the top-level nodes, picks out note-block wrappers,
 * and extracts their content + tags.
 */
function extractNoteBlocks(value: Value): NoteBlockData[] {
  return value
    .filter((node: any) => node.type === NOTE_BLOCK_TYPE)
    .map((node: any) => {
      const children = node.children ?? [];
      let title = "Untitled";
      if (children.length > 0) {
        const firstChild = children[0];
        if (firstChild?.children) {
          title =
            firstChild.children
              .map((c: any) => c.text ?? "")
              .join("")
              .trim() || "Untitled";
        }
      }

      const tags: string[] = [...(node.tags ?? [])];
      const walkForTags = (nodes: any[]) => {
        for (const n of nodes) {
          if (n.type === TAG_TYPE && n.value) {
            if (!tags.includes(n.value)) {
              tags.push(n.value);
            }
          }
          if (n.children) {
            walkForTags(n.children);
          }
        }
      };
      walkForTags(children);

      return {
        id: node.id,
        content: children,
        title,
        tags,
      };
    });
}

export function DailyEditor({ date }: DailyEditorProps) {
  const syncFromEditor = useNotesStore((s) => s.syncFromEditor);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => buildEditorValue(date),
  });

  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const noteBlocks = extractNoteBlocks(value);
        syncFromEditor(date, noteBlocks);
      }, 500);
    },
    [date, syncFromEditor]
  );

  return (
    <Plate editor={editor} onChange={handleChange}>
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>
    </Plate>
  );
}
