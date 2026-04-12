"use client";

import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useMounted } from "@/hooks/use-mounted";
import {
  Editor,
  Tldraw,
  createShapeId,
  useEditor as useTldrawEditor,
} from "tldraw";
import "tldraw/tldraw.css";

import { useNotesStore, type Block } from "@/stores/notes-store";
import {
  NoteCardShapeUtil,
  type NoteCardShape,
} from "@/components/canvas/note-card-shape";

const customShapeUtils = [NoteCardShapeUtil];

type FilterMode = "today" | "tag";

function derivePreview(content: any[], maxLength = 200): string {
  const texts: string[] = [];
  const walk = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.text !== undefined) {
        texts.push(node.text);
      }
      if (node.children) {
        walk(node.children);
      }
    }
  };
  walk(content);
  const full = texts.join(" ").trim();
  return full.length > maxLength ? full.slice(0, maxLength) + "..." : full;
}

function computePositions(
  blocks: Block[]
): Array<{ block: Block; x: number; y: number }> {
  const CARD_W = 290;
  const CARD_H = 170;
  const GAP = 20;
  const COLS = 4;

  let gridIndex = 0;
  return blocks.map((block) => {
    if (block.canvasPosition) {
      return { block, x: block.canvasPosition.x, y: block.canvasPosition.y };
    }
    const col = gridIndex % COLS;
    const row = Math.floor(gridIndex / COLS);
    gridIndex++;
    return {
      block,
      x: col * (CARD_W + GAP) + 50,
      y: row * (CARD_H + GAP) + 50,
    };
  });
}

function CanvasSync({
  blocks,
  filterKey,
}: {
  blocks: Block[];
  filterKey: string;
}) {
  const editor = useTldrawEditor();
  const hasSyncedRef = useRef(false);
  const listenerRef = useRef<(() => void) | null>(null);

  // Sync blocks to tldraw shapes
  useEffect(() => {
    if (!editor) return;

    // Tear down position listener during sync to prevent feedback loops
    listenerRef.current?.();
    listenerRef.current = null;

    const positioned = computePositions(blocks);
    const currentBlockIds = new Set(blocks.map((b) => b.id));

    const existingShapes = editor.getCurrentPageShapes();
    for (const shape of existingShapes) {
      if (
        shape.type === "note-card" &&
        !currentBlockIds.has((shape.props as any).blockId)
      ) {
        editor.deleteShape(shape.id);
      }
    }

    for (const { block, x, y } of positioned) {
      const shapeId = createShapeId(`note-${block.id}`);
      const existingShape = editor.getShape(shapeId);
      const preview = derivePreview(block.content as any[]);

      if (existingShape) {
        editor.updateShape({
          id: shapeId,
          type: "note-card",
          props: {
            blockId: block.id,
            title: block.title,
            preview,
            tags: block.tags,
          },
        });
      } else {
        editor.createShape({
          id: shapeId,
          type: "note-card",
          x,
          y,
          props: {
            w: 280,
            h: 160,
            blockId: block.id,
            title: block.title,
            preview,
            tags: block.tags,
          },
        });
      }
    }

    // Re-attach position listener after sync settles
    hasSyncedRef.current = true;
    const timeoutId = setTimeout(() => {
      if (!editor) return;

      let saveTimeout: ReturnType<typeof setTimeout>;
      const unsub = editor.store.listen(
        () => {
          clearTimeout(saveTimeout);
          saveTimeout = setTimeout(() => {
            const shapes = editor.getCurrentPageShapes();
            for (const shape of shapes) {
              if (shape.type === "note-card") {
                const blockId = (shape.props as any).blockId;
                if (blockId) {
                  useNotesStore
                    .getState()
                    .updateCanvasPosition(blockId, { x: shape.x, y: shape.y });
                }
              }
            }
          }, 500);
        },
        { source: "user", scope: "document" }
      );

      listenerRef.current = () => {
        unsub();
        clearTimeout(saveTimeout);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      listenerRef.current?.();
      listenerRef.current = null;
    };
  }, [editor, blocks, filterKey]);

  return null;
}

export default function CanvasPage() {
  const [filterMode, setFilterMode] = useState<FilterMode>("today");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const mounted = useMounted();
  const today = mounted ? format(new Date(), "yyyy-MM-dd") : "";

  // Read blocks imperatively to avoid re-render loops.
  // The canvas position listener writes back to the store, which would
  // re-trigger reactive selectors and cause infinite updates.
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const filterKey = filterMode === "today" ? today : `tag:${selectedTag}`;

  useEffect(() => {
    const state = useNotesStore.getState();
    if (filterMode === "tag") {
      setBlocks(selectedTag ? state.getBlocksByTag(selectedTag) : []);
    } else {
      setBlocks(today ? state.getBlocksByDate(today) : []);
    }
    setAllTags(state.getAllTags());
  }, [filterMode, selectedTag, today]);

  return (
    <main className="relative h-screen w-full">
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-lg border border-border/40 bg-background/90 px-3 py-2 shadow-md backdrop-blur-sm">
        <button
          onClick={() => setFilterMode("today")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            filterMode === "today"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilterMode("tag")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            filterMode === "tag"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          By Tag
        </button>

        {filterMode === "tag" && (
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-md border border-border/40 bg-background px-2 py-1 text-xs"
          >
            <option value="">Select tag...</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        )}

        <span className="text-xs text-muted-foreground">
          {blocks.length} block{blocks.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div style={{ position: "fixed", inset: 0 }} className="pt-14">
        <Tldraw
          shapeUtils={customShapeUtils}
          persistenceKey="cortex-canvas"
        >
          <CanvasSync blocks={blocks} filterKey={filterKey} />
        </Tldraw>
      </div>
    </main>
  );
}
