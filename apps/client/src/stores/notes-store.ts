import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ulid } from "ulid";
import type { Value } from "platejs";

export type Block = {
  id: string;
  content: Value;
  title: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  canvasPosition?: { x: number; y: number };
};

interface NotesStore {
  blocks: Record<string, Block>;

  createBlock: (date: string, content?: Value) => string;
  updateBlock: (id: string, updates: Partial<Omit<Block, "id">>) => void;
  deleteBlock: (id: string) => void;

  getBlocksByDate: (date: string) => Block[];
  getBlocksByTag: (tag: string) => Block[];
  getAllTags: () => string[];

  updateCanvasPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;

  syncFromEditor: (date: string, noteBlocks: NoteBlockData[]) => void;
}

export type NoteBlockData = {
  id: string;
  content: Value;
  title: string;
  tags: string[];
};

const deriveTitleFromContent = (content: Value): string => {
  if (!content || content.length === 0) return "Untitled";
  const firstNode = content[0];
  if (!firstNode || !("children" in firstNode)) return "Untitled";
  const children = firstNode.children as Array<{ text?: string }>;
  const text = children
    .map((child) => child.text ?? "")
    .join("")
    .trim();
  return text || "Untitled";
};

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      blocks: {},

      createBlock: (date, content) => {
        const id = ulid();
        const now = new Date().toISOString();
        const block: Block = {
          id,
          content: content ?? [
            { type: "p", children: [{ text: "" }], id: id + "_p" },
          ],
          title: content ? deriveTitleFromContent(content) : "Untitled",
          date,
          tags: [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          blocks: { ...state.blocks, [id]: block },
        }));
        return id;
      },

      updateBlock: (id, updates) => {
        set((state) => {
          const existing = state.blocks[id];
          if (!existing) return state;
          return {
            blocks: {
              ...state.blocks,
              [id]: {
                ...existing,
                ...updates,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      deleteBlock: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.blocks;
          return { blocks: rest };
        });
      },

      getBlocksByDate: (date) => {
        const blocks = get().blocks;
        return Object.values(blocks)
          .filter((b) => b.date === date)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
      },

      getBlocksByTag: (tag) => {
        const blocks = get().blocks;
        return Object.values(blocks)
          .filter((b) => b.tags.includes(tag))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      },

      getAllTags: () => {
        const blocks = get().blocks;
        const tagSet = new Set<string>();
        Object.values(blocks).forEach((b) =>
          b.tags.forEach((t) => tagSet.add(t))
        );
        return Array.from(tagSet).sort();
      },

      updateCanvasPosition: (id, position) => {
        set((state) => {
          const existing = state.blocks[id];
          if (!existing) return state;
          return {
            blocks: {
              ...state.blocks,
              [id]: { ...existing, canvasPosition: position },
            },
          };
        });
      },

      syncFromEditor: (date, noteBlocks) => {
        set((state) => {
          const newBlocks = { ...state.blocks };
          const existingDateBlockIds = new Set(
            Object.values(state.blocks)
              .filter((b) => b.date === date)
              .map((b) => b.id)
          );
          const incomingIds = new Set(noteBlocks.map((nb) => nb.id));

          // Delete blocks that no longer exist in the editor
          for (const id of existingDateBlockIds) {
            if (!incomingIds.has(id)) {
              delete newBlocks[id];
            }
          }

          // Create or update blocks from editor
          const now = new Date().toISOString();
          for (const nb of noteBlocks) {
            const existing = newBlocks[nb.id];
            if (existing) {
              newBlocks[nb.id] = {
                ...existing,
                content: nb.content,
                title: nb.title,
                tags: nb.tags,
                updatedAt: now,
              };
            } else {
              newBlocks[nb.id] = {
                id: nb.id,
                content: nb.content,
                title: nb.title,
                date,
                tags: nb.tags,
                createdAt: now,
                updatedAt: now,
              };
            }
          }

          return { blocks: newBlocks };
        });
      },
    }),
    {
      name: "cortex-notes-store",
    }
  )
);
