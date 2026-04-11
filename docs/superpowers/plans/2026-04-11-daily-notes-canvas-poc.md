# Daily Notes + Canvas POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a proof-of-concept daily notes editor with block-based structure that auto-populates a spatial tldraw canvas, using the existing Chronomer Next.js app.

**Architecture:** Zustand store (`useNotesStore`) persisted to localStorage holds the block data model. The daily journal page renders a single Plate.js editor with custom `note-block` wrapper nodes. The canvas page reads blocks from the store and renders them as custom tldraw `NoteCardShape` shapes. Tags are inline elements triggered by `#`, stored on the block in the Zustand store.

**Tech Stack:** Next.js 16, React 19, Plate.js v52, tldraw v4.2, Zustand, Tailwind CSS v4, TypeScript

---

## File Structure

### New Files

```
apps/client/src/
├── stores/
│   └── notes-store.ts              # Zustand store: Block type, CRUD, queries, localStorage persistence
├── components/
│   ├── editor/
│   │   ├── plugins/
│   │   │   ├── note-block-kit.tsx   # Plate plugin for note-block wrapper element
│   │   │   └── tag-kit.tsx          # Plate plugin for #tag inline element + combobox
│   │   └── daily-editor.tsx         # Daily journal editor: wraps Plate, syncs to store, date-aware
│   ├── ui/
│   │   ├── note-block-element.tsx   # Plate renderer for note-block (visual container)
│   │   ├── tag-element.tsx          # Plate renderer for inline tag pill
│   │   └── tag-input-element.tsx    # Plate renderer for tag combobox input (triggered by #)
│   └── canvas/
│       └── note-card-shape.tsx      # tldraw custom shape: NoteCardShapeUtil + component
```

### Modified Files

```
apps/client/package.json                              # Add zustand, ulid
apps/client/src/components/editor/editor-kit.tsx       # Add NoteBlockKit, TagKit to plugin array
apps/client/src/app/(core)/notes/page.tsx              # Rewrite: daily journal with date nav
apps/client/src/app/(core)/canvas/page.tsx             # Rewrite: auto-populated canvas
apps/client/src/components/app-sidebar.tsx              # Update nav links
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `apps/client/package.json`

- [ ] **Step 1: Install zustand and ulid**

```bash
cd apps/client && bun add zustand ulid
```

- [ ] **Step 2: Verify installation**

```bash
cd apps/client && bun run build 2>&1 | head -5
```

Expected: Build succeeds (or at least no new dependency errors).

- [ ] **Step 3: Commit**

```bash
git add apps/client/package.json apps/client/bun.lock
git commit -m "add zustand and ulid dependencies"
```

---

### Task 2: Zustand Notes Store

**Files:**
- Create: `apps/client/src/stores/notes-store.ts`

- [ ] **Step 1: Create the store**

```ts
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
```

- [ ] **Step 2: Verify the store compiles**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

Expected: No TypeScript errors related to the store file.

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/stores/notes-store.ts
git commit -m "add Zustand notes store with block CRUD and localStorage persistence"
```

---

### Task 3: Note-Block Plate Plugin

**Files:**
- Create: `apps/client/src/components/editor/plugins/note-block-kit.tsx`
- Create: `apps/client/src/components/ui/note-block-element.tsx`

This is the custom Plate element that wraps content within the daily journal. Each `note-block` is a block-level container. Its children are the actual content (paragraphs, code blocks, images, etc.).

- [ ] **Step 1: Create the note-block Plate plugin**

```tsx
// apps/client/src/components/editor/plugins/note-block-kit.tsx
"use client";

import { createPlatePlugin } from "platejs/react";
import { NoteBlockElement } from "@/components/ui/note-block-element";

export const NOTE_BLOCK_TYPE = "note-block";

export const NoteBlockPlugin = createPlatePlugin({
  key: NOTE_BLOCK_TYPE,
  node: {
    isElement: true,
    type: NOTE_BLOCK_TYPE,
  },
}).withComponent(NoteBlockElement);

export const NoteBlockKit = [NoteBlockPlugin];
```

- [ ] **Step 2: Create the note-block element renderer**

```tsx
// apps/client/src/components/ui/note-block-element.tsx
"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement } from "platejs/react";
import { cn } from "@/lib/utils";

export function NoteBlockElement(props: PlateElementProps) {
  const { children, element } = props;
  const tags: string[] = (element as any).tags ?? [];

  return (
    <PlateElement
      {...props}
      className={cn(
        "relative my-3 rounded-md border border-border/40 bg-card/30 px-4 py-3",
        "first:mt-0"
      )}
    >
      {tags.length > 0 && (
        <div
          className="mb-2 flex flex-wrap gap-1.5"
          contentEditable={false}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {children}
    </PlateElement>
  );
}
```

- [ ] **Step 3: Verify both files compile**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add apps/client/src/components/editor/plugins/note-block-kit.tsx apps/client/src/components/ui/note-block-element.tsx
git commit -m "add note-block Plate plugin and element renderer"
```

---

### Task 4: Tag Inline Plugin

**Files:**
- Create: `apps/client/src/components/editor/plugins/tag-kit.tsx`
- Create: `apps/client/src/components/ui/tag-element.tsx`
- Create: `apps/client/src/components/ui/tag-input-element.tsx`

Tags work like mentions: `#` triggers a combobox, selecting a tag inserts an inline element. The tag plugin follows the exact same pattern as the existing `MentionKit` but with `#` as trigger.

- [ ] **Step 1: Create the tag Plate plugin**

```tsx
// apps/client/src/components/editor/plugins/tag-kit.tsx
"use client";

import { createPlatePlugin } from "platejs/react";
import { TagElement } from "@/components/ui/tag-element";
import { TagInputElement } from "@/components/ui/tag-input-element";

export const TAG_TYPE = "tag";
export const TAG_INPUT_TYPE = "tag_input";

export const TagPlugin = createPlatePlugin({
  key: TAG_TYPE,
  node: {
    isElement: true,
    isInline: true,
    isVoid: true,
    type: TAG_TYPE,
  },
}).withComponent(TagElement);

export const TagInputPlugin = createPlatePlugin({
  key: TAG_INPUT_TYPE,
  node: {
    isElement: true,
    isInline: true,
    type: TAG_INPUT_TYPE,
  },
}).withComponent(TagInputElement);

export const TagKit = [
  TagPlugin,
  TagInputPlugin,
];
```

**Note:** The tag combobox trigger (`#`) and insertion logic will be handled in the `TagInputElement` component using the same `InlineCombobox` infrastructure that the existing `MentionInputElement` uses. However, the trigger mechanism in Plate v52 uses the `MentionPlugin`/`MentionInputPlugin` from `@platejs/mention/react` which has built-in trigger handling. Since we're creating a custom plugin from scratch, we need to handle the trigger differently.

**Revised approach:** Instead of building trigger detection from scratch, reuse the `MentionPlugin` infrastructure with a different trigger character. This is the pattern Plate supports — you can have multiple mention-like plugins with different triggers.

Replace the tag-kit.tsx with:

```tsx
// apps/client/src/components/editor/plugins/tag-kit.tsx
"use client";

import { MentionInputPlugin, MentionPlugin } from "@platejs/mention/react";
import { TagElement } from "@/components/ui/tag-element";
import { TagInputElement } from "@/components/ui/tag-input-element";

export const TAG_TYPE = "tag";
export const TAG_INPUT_TYPE = "tag_input";

export const TagPlugin = MentionPlugin.configure({
  options: {
    trigger: "#",
    triggerPreviousCharPattern: /^$|^[\s"']$/,
  },
  node: {
    type: TAG_TYPE,
  },
}).withComponent(TagElement);

export const TagInputPlugin = MentionInputPlugin.configure({
  node: {
    type: TAG_INPUT_TYPE,
  },
}).withComponent(TagInputElement);

export const TagKit = [TagPlugin, TagInputPlugin];
```

**Important:** This approach creates a conflict — there are now two plugins based on `MentionPlugin` (the existing one for `@` mentions and this one for `#` tags). They share the same plugin key internally. To avoid this, we need a different approach. The cleanest solution is to configure the tag as a **second mention plugin instance** by extending with a unique key:

```tsx
// apps/client/src/components/editor/plugins/tag-kit.tsx
"use client";

import { createPlatePlugin } from "platejs/react";
import { MentionInputPlugin, MentionPlugin } from "@platejs/mention/react";
import { TagElement } from "@/components/ui/tag-element";
import { TagInputElement } from "@/components/ui/tag-input-element";

export const TAG_TYPE = "tag";
export const TAG_INPUT_TYPE = "tag_input";

export const TagPlugin = createPlatePlugin({
  key: TAG_TYPE,
  node: {
    isElement: true,
    isInline: true,
    isVoid: true,
    type: TAG_TYPE,
  },
  options: {
    trigger: "#",
    triggerPreviousCharPattern: /^$|^[\s"']$/,
    createComboboxInput: (trigger: string) => ({
      children: [{ text: "" }],
      trigger,
      type: TAG_INPUT_TYPE,
    }),
  },
  plugins: [
    createPlatePlugin({
      key: TAG_INPUT_TYPE,
      node: {
        isElement: true,
        isInline: true,
        type: TAG_INPUT_TYPE,
      },
    }).withComponent(TagInputElement),
  ],
}).withComponent(TagElement);

export const TagKit = [TagPlugin];
```

**Reality check:** The Plate v52 mention trigger system is internal to the `@platejs/mention` package and hooking into it from a custom plugin requires matching its internal API exactly, which is fragile. The pragmatic POC approach is simpler — since the existing `MentionKit` uses `@` trigger, and we won't actually use `@` mentions in the daily journal, we can **repurpose the existing MentionPlugin** by changing its trigger to `#` and renaming the components. Or we can keep both and see if Plate supports multiple mention plugin instances.

**Final pragmatic approach for the POC:** Keep the `@` mention plugin as-is (it already works). For tags, use a simpler approach — add a custom toolbar button or slash command `/tag` that prompts for a tag name and inserts a tag inline element. The `#` trigger can be attempted but if it conflicts with mentions, the slash command is the fallback.

Let's proceed with the simpler version that definitely works:

```tsx
// apps/client/src/components/editor/plugins/tag-kit.tsx
"use client";

import { createPlatePlugin } from "platejs/react";
import { TagElement } from "@/components/ui/tag-element";

export const TAG_TYPE = "tag";

export const TagPlugin = createPlatePlugin({
  key: TAG_TYPE,
  node: {
    isElement: true,
    isInline: true,
    isVoid: true,
    type: TAG_TYPE,
  },
}).withComponent(TagElement);

export const TagKit = [TagPlugin];
```

The tag insertion will be handled via the existing slash command system (Task 7 will add a `/tag` slash command) and potentially a `#` keyboard shortcut if the mention trigger system supports multiple instances. This keeps the plugin definition clean and avoids fragile internal API coupling.

- [ ] **Step 2: Create the tag element renderer**

```tsx
// apps/client/src/components/ui/tag-element.tsx
"use client";

import type { PlateElementProps } from "platejs/react";
import { PlateElement, useSelected, useFocused } from "platejs/react";
import { cn } from "@/lib/utils";

interface TagElementData {
  value: string;
}

export function TagElement(props: PlateElementProps) {
  const { children, element } = props;
  const selected = useSelected();
  const focused = useFocused();
  const tagValue = (element as any).value as string;

  return (
    <PlateElement
      {...props}
      as="span"
      className={cn(
        "inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
        "align-baseline",
        selected && focused && "ring-2 ring-primary/30"
      )}
      contentEditable={false}
      draggable
    >
      <span>#{tagValue}</span>
      {children}
    </PlateElement>
  );
}
```

- [ ] **Step 3: Verify files compile**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add apps/client/src/components/editor/plugins/tag-kit.tsx apps/client/src/components/ui/tag-element.tsx
git commit -m "add tag inline element plugin and renderer"
```

---

### Task 5: Register Plugins in EditorKit

**Files:**
- Modify: `apps/client/src/components/editor/editor-kit.tsx`

- [ ] **Step 1: Add NoteBlockKit and TagKit imports and register them**

Add these imports at the top of the file (after the existing plugin imports):

```tsx
import { NoteBlockKit } from "@/components/editor/plugins/note-block-kit";
import { TagKit } from "@/components/editor/plugins/tag-kit";
```

Add them to the `EditorKit` array. Place `NoteBlockKit` in the Elements section (after `...MentionKit`) and `TagKit` right after it:

```tsx
export const EditorKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,
  ...NoteBlockKit,
  ...TagKit,

  // ... rest stays the same
];
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/components/editor/editor-kit.tsx
git commit -m "register note-block and tag plugins in EditorKit"
```

---

### Task 6: Daily Journal Editor Component

**Files:**
- Create: `apps/client/src/components/editor/daily-editor.tsx`

This is the core component. It wraps Plate with the note-block document structure and syncs to the Zustand store.

- [ ] **Step 1: Create the daily editor component**

```tsx
// apps/client/src/components/editor/daily-editor.tsx
"use client";

import { useCallback, useRef } from "react";
import { type Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";
import { ulid } from "ulid";

import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/ui/editor";
import { NOTE_BLOCK_TYPE } from "@/components/editor/plugins/note-block-kit";
import { TAG_TYPE } from "@/components/editor/plugins/tag-kit";
import { useNotesStore, type NoteBlockData } from "@/stores/notes-store";

interface DailyEditorProps {
  date: string; // YYYY-MM-DD
}

const DAILY_STORE_PREFIX = "daily-editor-";

/**
 * Build the initial Plate value from blocks in the store for a given date.
 * Each block becomes a note-block wrapper node containing its content children.
 */
function buildEditorValue(date: string): Value {
  const blocks = useNotesStore.getState().getBlocksByDate(date);

  if (blocks.length === 0) {
    // Create one empty note-block to start with
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
      // Derive title from first text content
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

      // Collect tags from inline tag elements within the content
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
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/components/editor/daily-editor.tsx
git commit -m "add DailyEditor component with note-block structure and store sync"
```

---

### Task 7: Daily Journal Page

**Files:**
- Modify: `apps/client/src/app/(core)/notes/page.tsx`

Rewrite the notes page to be the daily journal. Date header, date navigation, and the DailyEditor.

- [ ] **Step 1: Rewrite the notes page**

```tsx
// apps/client/src/app/(core)/notes/page.tsx
"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DailyEditor } from "@/components/editor/daily-editor";
import { Toaster } from "sonner";

function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export default function NotesPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const dateKey = formatDateKey(currentDate);
  const isToday = formatDateKey(new Date()) === dateKey;

  return (
    <div className="bg-background min-h-screen w-full">
      {/* Date header */}
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setCurrentDate((d) => subDays(d, 1))}
            className="rounded-md p-1.5 hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </h1>
            {!isToday && (
              <button
                onClick={() => setCurrentDate(new Date())}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={() => setCurrentDate((d) => addDays(d, 1))}
            className="rounded-md p-1.5 hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <DailyEditor key={dateKey} date={dateKey} />
      </div>

      <Toaster />
    </div>
  );
}
```

The `key={dateKey}` on `DailyEditor` ensures the editor remounts when navigating dates, loading the correct blocks from the store.

- [ ] **Step 2: Verify the page renders**

```bash
cd /Users/devpra/repos/chronomer && bun run dev --filter=client
```

Open `http://localhost:3000/notes` in a browser. Verify:
- Date header shows today's date
- Left/right arrows navigate dates
- "Today" button appears when not on today
- Editor renders with one empty note-block
- Typing works inside the block
- Content persists on page refresh (check localStorage for `cortex-notes-store`)

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/app/\(core\)/notes/page.tsx
git commit -m "rewrite notes page as daily journal with date navigation"
```

---

### Task 8: Custom tldraw NoteCardShape

**Files:**
- Create: `apps/client/src/components/canvas/note-card-shape.tsx`

A custom tldraw shape that renders a block as a card. Extends `BaseBoxShapeUtil` following the same pattern as tldraw's built-in `BookmarkShapeUtil`.

- [ ] **Step 1: Create the NoteCardShape**

```tsx
// apps/client/src/components/canvas/note-card-shape.tsx
"use client";

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  T,
  TLBaseShape,
  DefaultSpinner,
} from "@tldraw/editor";

// Shape props type
type NoteCardShapeProps = {
  w: number;
  h: number;
  blockId: string;
  title: string;
  preview: string;
  tags: string[];
};

// The shape type
export type NoteCardShape = TLBaseShape<"note-card", NoteCardShapeProps>;

// Props schema for tldraw
export const noteCardShapeProps = {
  w: T.number,
  h: T.number,
  blockId: T.string,
  title: T.string,
  preview: T.string,
  tags: T.arrayOf(T.string),
};

export class NoteCardShapeUtil extends BaseBoxShapeUtil<NoteCardShape> {
  static override type = "note-card" as const;
  static override props = noteCardShapeProps;

  override canResize() {
    return true;
  }

  override getDefaultProps(): NoteCardShape["props"] {
    return {
      w: 280,
      h: 160,
      blockId: "",
      title: "Untitled",
      preview: "",
      tags: [],
    };
  }

  override component(shape: NoteCardShape) {
    const { title, preview, tags } = shape.props;

    return (
      <HTMLContainer>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(30, 30, 40, 0.95)",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflow: "hidden",
            fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>

          {preview && (
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: "1.5",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                flex: 1,
              }}
            >
              {preview}
            </div>
          )}

          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginTop: "auto",
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    color: "rgba(167, 139, 250, 0.9)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: NoteCardShape) {
    return (
      <rect
        width={shape.props.w}
        height={shape.props.h}
        rx="8"
        ry="8"
      />
    );
  }
}
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/components/canvas/note-card-shape.tsx
git commit -m "add custom tldraw NoteCardShape for rendering blocks on canvas"
```

---

### Task 9: Canvas Page with Auto-Population

**Files:**
- Modify: `apps/client/src/app/(core)/canvas/page.tsx`

Rewrite the canvas page to read blocks from the Zustand store and create `NoteCardShape` instances. Include a filter bar for date/tag selection.

- [ ] **Step 1: Rewrite the canvas page**

```tsx
// apps/client/src/app/(core)/canvas/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
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

/**
 * Derive a plain-text preview from a block's Plate content.
 * Walks the content tree and concatenates text nodes, truncated.
 */
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

/**
 * Auto-layout: arrange blocks in a grid.
 * Blocks with a saved canvasPosition keep their position.
 * New blocks get placed in the next grid slot.
 */
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
  const updateCanvasPosition = useNotesStore((s) => s.updateCanvasPosition);
  const prevBlockIdsRef = useRef<Set<string>>(new Set());

  // Sync blocks to tldraw shapes
  useEffect(() => {
    if (!editor) return;

    const positioned = computePositions(blocks);
    const currentBlockIds = new Set(blocks.map((b) => b.id));

    // Remove shapes for blocks that no longer match the filter
    const existingShapes = editor.getCurrentPageShapes();
    for (const shape of existingShapes) {
      if (
        shape.type === "note-card" &&
        !currentBlockIds.has((shape.props as any).blockId)
      ) {
        editor.deleteShape(shape.id);
      }
    }

    // Create or update shapes
    for (const { block, x, y } of positioned) {
      const shapeId = createShapeId(`note-${block.id}`);
      const existingShape = editor.getShape(shapeId);
      const preview = derivePreview(block.content as any[]);

      if (existingShape) {
        // Update content but keep user-positioned coordinates
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

    prevBlockIdsRef.current = currentBlockIds;
  }, [editor, blocks, filterKey]);

  // Save position when shapes are moved
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const shapes = editor.getCurrentPageShapes();
      for (const shape of shapes) {
        if (shape.type === "note-card") {
          const blockId = (shape.props as any).blockId;
          if (blockId) {
            updateCanvasPosition(blockId, { x: shape.x, y: shape.y });
          }
        }
      }
    };

    // Debounce position saves
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedChange = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleChange, 300);
    };

    const unsub = editor.store.listen(debouncedChange, {
      source: "user",
      scope: "document",
    });

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [editor, updateCanvasPosition]);

  return null;
}

export default function CanvasPage() {
  const [filterMode, setFilterMode] = useState<FilterMode>("today");
  const [selectedTag, setSelectedTag] = useState<string>("");

  const today = format(new Date(), "yyyy-MM-dd");
  const allTags = useNotesStore((s) => s.getAllTags());
  const blocksByDate = useNotesStore((s) => s.getBlocksByDate(today));
  const blocksByTag = useNotesStore((s) =>
    selectedTag ? s.getBlocksByTag(selectedTag) : []
  );

  const blocks = filterMode === "today" ? blocksByDate : blocksByTag;
  const filterKey = filterMode === "today" ? today : `tag:${selectedTag}`;

  return (
    <main className="relative h-screen w-full">
      {/* Filter bar */}
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

      {/* Canvas */}
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
```

- [ ] **Step 2: Verify the canvas page**

```bash
cd /Users/devpra/repos/chronomer && bun run dev --filter=client
```

Open `http://localhost:3000/canvas` in a browser. Verify:
- If you've written blocks on the `/notes` page, they appear as cards on the canvas
- Cards show title, preview text, and tags
- You can drag cards to reposition them
- Positions persist on page refresh
- "Today" / "By Tag" filter buttons work
- Tag dropdown shows tags from the store
- tldraw's native arrow tool can draw connections between cards

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/app/\(core\)/canvas/page.tsx
git commit -m "rewrite canvas page with auto-populated NoteCardShapes and filtering"
```

---

### Task 10: Update Sidebar Navigation

**Files:**
- Modify: `apps/client/src/components/app-sidebar.tsx`

- [ ] **Step 1: Update the sidebar nav data**

In `apps/client/src/components/app-sidebar.tsx`, replace the `navMain` array in the `data` object:

```tsx
navMain: [
  {
    title: "Daily Journal",
    url: "/notes",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Canvas",
    url: "/canvas",
    icon: Frame,
  },
],
```

Remove the unused icon imports (`AudioWaveform`, `Bot`, `BookOpen`, `Command`, `GalleryVerticalEnd`, `Map`, `PieChart`, `Settings2`) and keep only `SquareTerminal` and `Frame` (which is already imported). Add any missing imports if needed.

- [ ] **Step 2: Verify sidebar links work**

Open the app, click "Daily Journal" — navigates to `/notes`.
Click "Canvas" — navigates to `/canvas`.

- [ ] **Step 3: Commit**

```bash
git add apps/client/src/components/app-sidebar.tsx
git commit -m "update sidebar navigation for daily journal and canvas"
```

---

### Task 11: End-to-End Smoke Test

No new files. This is a manual verification task.

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/devpra/repos/chronomer && bun run dev --filter=client
```

- [ ] **Step 2: Test daily journal flow**

1. Navigate to `/notes`
2. Type a line of text in the first block (e.g., "Meeting with Sarah about auth")
3. Press Enter twice at the end to create a new block
4. Type "Pick up groceries" in the second block
5. Navigate to yesterday using the left arrow — should show empty
6. Navigate back to today — both blocks should be there
7. Refresh the page — blocks persist

- [ ] **Step 3: Test canvas auto-population**

1. Navigate to `/canvas`
2. Verify both blocks appear as cards
3. Drag a card to a new position
4. Refresh — position persists
5. Go back to `/notes`, create a third block
6. Return to `/canvas` — third card appears in the grid

- [ ] **Step 4: Test tag flow**

1. On `/notes`, use slash command or manually insert a tag element
2. Verify the tag appears on the note-block as a pill
3. Navigate to `/canvas`, switch to "By Tag" filter
4. Select the tag — only the tagged block appears

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A && git commit -m "fix: smoke test adjustments"
```

Only commit if changes were made during testing.
