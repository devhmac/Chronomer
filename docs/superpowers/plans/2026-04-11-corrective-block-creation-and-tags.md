# Corrective Plan: Block Creation, Deletion, and Tag Insertion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the missing core behaviors: creating new blocks via Enter, deleting empty blocks via Backspace, and inserting tags via `#` using Plate's existing MentionPlugin infrastructure.

**Architecture:** The note-block plugin gets an `overrideEditor` that intercepts `insertBreak` and `deleteBackward` to manage block boundaries. Tags reuse the MentionPlugin/MentionInputPlugin pattern from `@platejs/mention` with `#` as the trigger character instead of `@`. The custom tag plugin from the previous implementation is deleted and replaced.

**Tech Stack:** Plate.js v52 (`createSlatePlugin`, `createTSlatePlugin`, `overrideEditor`, `withTriggerCombobox`), `@platejs/mention`, `@platejs/combobox`

**Verified APIs (all confirmed by reading actual source in node_modules):**
- `overrideEditor` pattern: destructure `tf: { insertBreak }` from ctx, return `transforms: { insertBreak() { ... } }` (confirmed in `@platejs/code-block/dist/BaseCodeBlockPlugin-BntJ075t.js`)
- `editor.api.above({ match })` — find ancestor node (confirmed in code-block plugin)
- `editor.api.isEmpty(selection, { block: true })` — check if current block is empty (confirmed in code-block plugin)
- `editor.api.isStart(point, path)` — check if cursor is at start of a path (confirmed in code-block plugin)
- `editor.tf.insertNodes(node, { at, select })` — insert nodes (confirmed in code-block plugin)
- `editor.tf.removeNodes({ at })` — remove nodes at path (confirmed in Slate types)
- `editor.tf.select(location)` — move selection (confirmed in code-block plugin)
- `MentionPlugin` pattern: `createTSlatePlugin` with `options: { trigger, createComboboxInput }` + `.overrideEditor(withTriggerCombobox)` (confirmed in `@platejs/mention/dist/BaseMentionPlugin-uPSCCRSr.js`)
- `getMentionOnSelectItem({ key })` — factory for onSelect handler (confirmed in `@platejs/mention/dist/index.js`)

---

## File Structure

### Files to Modify

```
apps/client/src/components/editor/plugins/note-block-kit.tsx  — ADD overrideEditor with insertBreak + deleteBackward
apps/client/src/components/editor/plugins/tag-kit.tsx          — REPLACE entirely: use MentionPlugin pattern with # trigger
apps/client/src/components/editor/editor-kit.tsx               — REMOVE old TagKit, ADD new TagKit (imports change)
apps/client/src/app/(core)/notes/page.tsx                      — FIX hydration error (commit pending fix)
```

### Files to Create

```
apps/client/src/components/ui/tag-node.tsx   — Tag element + tag input element (adapted from mention-node.tsx)
```

### Files to Delete

```
apps/client/src/components/ui/tag-element.tsx       — Dead code, replaced by tag-node.tsx
apps/client/src/components/ui/tag-input-element.tsx  — Never existed (was in plan but never created)
```

---

### Task 1: Fix Notes Page Hydration Error

**Files:**
- Modify: `apps/client/src/app/(core)/notes/page.tsx`

This fix was written but never committed. The issue: `useState(() => new Date())` produces different values on server vs client.

- [ ] **Step 1: Verify the fix is already in the file**

Read `apps/client/src/app/(core)/notes/page.tsx`. It should already have:
- `const [currentDate, setCurrentDate] = useState<Date | null>(null);`
- A `useEffect` that calls `setCurrentDate(new Date())`
- An early return `if (!currentDate)` with an empty div

If the fix is NOT there, apply it:

Replace the existing state initialization and add the early return:

```tsx
// OLD (causes hydration mismatch):
const [currentDate, setCurrentDate] = useState(() => new Date());

// NEW:
const [currentDate, setCurrentDate] = useState<Date | null>(null);

useEffect(() => {
  setCurrentDate(new Date());
}, []);

if (!currentDate) {
  return <div className="bg-background h-screen w-full" />;
}
```

Also add `useEffect` to the import from `react`:
```tsx
import { useEffect, useState } from "react";
```

- [ ] **Step 2: Verify the page loads without hydration warnings**

Run: `cd /Users/devpra/repos/chronomer/apps/client && bun next dev`

Open `http://localhost:3000/notes` in a browser. Open the browser console. Verify:
- The page loads and shows today's date
- There is NO "Hydration failed" error in the console
- The editor renders and is editable

- [ ] **Step 3: Commit**

```bash
cd /Users/devpra/repos/chronomer
git add 'apps/client/src/app/(core)/notes/page.tsx'
git commit -m "fix: resolve hydration mismatch on notes page by deferring Date to client"
```

---

### Task 2: Note-Block insertBreak Override (Block Creation)

**Files:**
- Modify: `apps/client/src/components/editor/plugins/note-block-kit.tsx`

This is the critical missing feature. When the user presses Enter on an empty paragraph that is the last child of a note-block, we exit the current block and create a new empty note-block below it.

- [ ] **Step 1: Read the current note-block-kit.tsx**

Read `apps/client/src/components/editor/plugins/note-block-kit.tsx`. It currently contains only:
```tsx
export const NoteBlockPlugin = createPlatePlugin({
  key: NOTE_BLOCK_TYPE,
  node: { isElement: true, type: NOTE_BLOCK_TYPE },
}).withComponent(NoteBlockElement);
```

- [ ] **Step 2: Replace the entire file with the version that includes overrideEditor**

Replace `apps/client/src/components/editor/plugins/note-block-kit.tsx` with:

```tsx
'use client';

import { createSlatePlugin, type SlateEditor, type Path } from 'platejs';
import { toPlatePlugin } from 'platejs/react';
import { ulid } from 'ulid';
import { NoteBlockElement } from '@/components/ui/note-block-element';

export const NOTE_BLOCK_TYPE = 'note-block';

/**
 * Check if the cursor is inside an empty paragraph that is the last child
 * of a note-block. This is the condition for "Enter exits the block."
 */
function shouldExitNoteBlock(editor: SlateEditor): { noteBlockPath: Path } | null {
  if (!editor.selection) return null;

  // Find the nearest note-block ancestor
  const noteBlockEntry = editor.api.above({
    match: (n: any) => n.type === NOTE_BLOCK_TYPE,
  });
  if (!noteBlockEntry) return null;

  const [noteBlock, noteBlockPath] = noteBlockEntry;
  const children = (noteBlock as any).children ?? [];

  // Must have at least 2 children (some content + the empty trailing paragraph)
  // If there's only 1 child and it's empty, we keep the block (don't create empty blocks)
  if (children.length < 2) return null;

  // Get the current block (paragraph) the cursor is in
  const blockEntry = editor.api.block();
  if (!blockEntry) return null;

  const [block, blockPath] = blockEntry;

  // Is this block the last child of the note-block?
  const lastChildIndex = children.length - 1;
  const isLastChild = blockPath[blockPath.length - 1] === lastChildIndex;
  if (!isLastChild) return null;

  // Is this block empty?
  const isEmpty = editor.api.isEmpty(editor.selection, { block: true });
  if (!isEmpty) return null;

  return { noteBlockPath };
}

/**
 * Check if the cursor is at the start of the first child of a note-block,
 * and the entire note-block is empty. This is the condition for
 * "Backspace deletes the empty block."
 */
function shouldDeleteNoteBlock(editor: SlateEditor): { noteBlockPath: Path } | null {
  if (!editor.selection) return null;
  if (editor.api.isExpanded()) return null;

  const noteBlockEntry = editor.api.above({
    match: (n: any) => n.type === NOTE_BLOCK_TYPE,
  });
  if (!noteBlockEntry) return null;

  const [noteBlock, noteBlockPath] = noteBlockEntry;
  const children = (noteBlock as any).children ?? [];

  // Only delete if the note-block has exactly one child and it's empty
  if (children.length !== 1) return null;

  const isEmpty = editor.api.isEmpty(editor.selection, { block: true });
  if (!isEmpty) return null;

  // Don't delete if this is the only note-block in the document
  const parent = editor.api.parent(noteBlockPath);
  if (!parent) return null;
  const [parentNode] = parent;
  const siblings = (parentNode as any).children ?? [];
  const noteBlockSiblings = siblings.filter((s: any) => s.type === NOTE_BLOCK_TYPE);
  if (noteBlockSiblings.length <= 1) return null;

  return { noteBlockPath };
}

const BaseNoteBlockPlugin = createSlatePlugin({
  key: NOTE_BLOCK_TYPE,
  node: {
    isElement: true,
    type: NOTE_BLOCK_TYPE,
  },
}).overrideEditor(({ editor, tf: { insertBreak, deleteBackward } }) => ({
  transforms: {
    insertBreak() {
      const exit = shouldExitNoteBlock(editor);

      if (exit) {
        const { noteBlockPath } = exit;

        // Remove the empty trailing paragraph the cursor is in
        if (editor.selection) {
          editor.tf.removeNodes({ at: editor.selection });
        }

        // Create a new note-block after the current one
        const newBlockId = ulid();
        const newParagraphId = ulid();
        const newNoteBlock = {
          type: NOTE_BLOCK_TYPE,
          id: newBlockId,
          tags: [],
          children: [{ type: 'p', id: newParagraphId, children: [{ text: '' }] }],
        };

        // Insert after the current note-block
        const insertPath = [...noteBlockPath.slice(0, -1), noteBlockPath[noteBlockPath.length - 1] + 1];
        editor.tf.insertNodes(newNoteBlock, { at: insertPath });

        // Move cursor to the start of the new note-block's first paragraph
        editor.tf.select(editor.api.start([...insertPath, 0]));

        return;
      }

      // Default: normal Enter behavior (new paragraph within the block)
      insertBreak();
    },

    deleteBackward(unit) {
      const del = shouldDeleteNoteBlock(editor);

      if (del) {
        const { noteBlockPath } = del;
        const blockIndex = noteBlockPath[noteBlockPath.length - 1];

        // Remove this empty note-block
        editor.tf.removeNodes({ at: noteBlockPath });

        // Move cursor to the end of the previous note-block
        if (blockIndex > 0) {
          const prevPath = [...noteBlockPath.slice(0, -1), blockIndex - 1];
          const prevBlock = editor.api.node(prevPath);
          if (prevBlock) {
            const prevChildren = (prevBlock[0] as any).children ?? [];
            const lastChildPath = [...prevPath, prevChildren.length - 1];
            const endPoint = editor.api.end(lastChildPath);
            if (endPoint) {
              editor.tf.select(endPoint);
            }
          }
        }

        return;
      }

      // Default: normal Backspace behavior
      deleteBackward(unit);
    },
  },
}));

export const NoteBlockPlugin = toPlatePlugin(BaseNoteBlockPlugin).withComponent(NoteBlockElement);

export const NoteBlockKit = [NoteBlockPlugin];
```

**What this does:**
- `shouldExitNoteBlock`: checks if cursor is in an empty paragraph that is the LAST child of a note-block, AND the note-block has at least 2 children (so it has real content above the empty line). If yes → exit the block.
- `shouldDeleteNoteBlock`: checks if cursor is in a note-block with exactly 1 empty child, and there are other note-blocks in the document. If yes → delete the block.
- `insertBreak` override: on exit condition, removes the empty paragraph, creates a new note-block sibling, moves cursor into it. Otherwise, calls original `insertBreak` (normal new paragraph).
- `deleteBackward` override: on delete condition, removes the note-block, moves cursor to end of previous block. Otherwise, calls original `deleteBackward`.

- [ ] **Step 3: Verify the build compiles**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -15
```

Expected: Build succeeds.

If there are type errors with `editor.api.end`, `editor.api.parent`, `editor.api.isExpanded`, or `editor.api.node` — these are all standard Slate/Plate editor API methods. If any don't exist under those names in v52, check what the actual method name is by running:
```bash
grep "end\|parent\|isExpanded\|node" /path/to/platejs/dist/index.d.ts
```
and adapt accordingly.

- [ ] **Step 4: Manual test — block creation**

Run the dev server: `cd /Users/devpra/repos/chronomer/apps/client && bun next dev`

Open `http://localhost:3000/notes`. Test:

1. Type "Meeting with Sarah about auth" — this is block 1
2. Press Enter — a new empty paragraph appears WITHIN block 1 (normal behavior)
3. Leave that paragraph empty and press Enter again — a NEW note-block should appear below block 1 with its own visual border
4. Type "Pick up groceries" in block 2
5. You should now see TWO visually distinct blocks with borders

If step 3 does not create a new block, the `shouldExitNoteBlock` logic is not triggering. Check the browser console for errors. Common issue: the `editor.api.above` match function may not find the note-block if the node structure is different than expected.

- [ ] **Step 5: Manual test — block deletion**

1. With two blocks on the page, click into the second block
2. Select all text in block 2 and delete it (Ctrl+A then Backspace within the block)
3. Now you have an empty block 2. Press Backspace.
4. Block 2 should disappear and cursor should be at the end of block 1.

- [ ] **Step 6: Manual test — store sync**

1. Create 2-3 blocks with different content
2. Open browser devtools → Application → Local Storage → `cortex-notes-store`
3. Verify the store has multiple blocks with different IDs and titles
4. Navigate to `/canvas` → verify multiple cards appear

- [ ] **Step 7: Commit**

```bash
cd /Users/devpra/repos/chronomer
git add apps/client/src/components/editor/plugins/note-block-kit.tsx
git commit -m "feat: add block creation (Enter) and deletion (Backspace) to note-block plugin"
```

---

### Task 3: Replace Custom Tag Plugin with MentionPlugin-Based Tags

**Files:**
- Modify: `apps/client/src/components/editor/plugins/tag-kit.tsx` — REPLACE entirely
- Create: `apps/client/src/components/ui/tag-node.tsx` — Tag element + input element
- Delete: `apps/client/src/components/ui/tag-element.tsx` — Old dead code
- Modify: `apps/client/src/components/editor/editor-kit.tsx` — Update TagKit import, remove MentionKit

**Strategy:** We don't need `@` mentions in this POC. We need `#` tags. We will:
1. Remove `MentionKit` from EditorKit (we don't use @mentions)
2. Replace `TagKit` with a new implementation that is literally the MentionPlugin pattern but with `trigger: '#'`, its own keys (`'tag'` and `'tag_input'`), and its own components

This is adapted directly from `@platejs/mention/dist/BaseMentionPlugin-uPSCCRSr.js` (the actual source, not speculation).

- [ ] **Step 1: Create the tag-node.tsx component (adapted from mention-node.tsx)**

Create `apps/client/src/components/ui/tag-node.tsx`:

```tsx
'use client';

import type { TComboboxInputElement, TMentionElement } from 'platejs';
import { IS_APPLE, KEYS } from 'platejs';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useFocused, useReadOnly, useSelected } from 'platejs/react';
import * as React from 'react';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/stores/notes-store';
import { getMentionOnSelectItem } from '@platejs/mention';

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox';

// ---- Rendered tag element (after selection) ----

export function TagElement(
  props: PlateElementProps<TMentionElement>
) {
  const element = props.element;
  const selected = useSelected();
  const focused = useFocused();
  const mounted = useMounted();
  const readOnly = useReadOnly();

  return (
    <PlateElement
      {...props}
      attributes={{
        ...props.attributes,
        contentEditable: false,
        'data-slate-value': element.value,
        draggable: true,
      }}
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 align-baseline text-xs font-medium text-primary',
        !readOnly && 'cursor-pointer',
        selected && focused && 'ring-2 ring-primary/30'
      )}
    >
      {mounted && IS_APPLE ? (
        <>
          {props.children}
          #
          {element.value}
        </>
      ) : (
        <>
          #
          {element.value}
          {props.children}
        </>
      )}
    </PlateElement>
  );
}

// ---- Tag input combobox (shown while typing after #) ----

const onSelectTag = getMentionOnSelectItem({ key: 'tag' });

export function TagInputElement(
  props: PlateElementProps<TComboboxInputElement>
) {
  const { editor, element } = props;
  const [search, setSearch] = React.useState('');
  const allTags = useNotesStore((s) => s.getAllTags());

  // Build items from existing tags in the store, plus the typed search as a "create new" option
  const items = React.useMemo(() => {
    const existing = allTags.map((tag, i) => ({
      key: `existing-${i}`,
      text: tag,
    }));

    // If the user is typing something that doesn't match an existing tag, offer to create it
    if (search && !allTags.includes(search)) {
      existing.unshift({ key: 'new', text: search });
    }

    return existing;
  }, [allTags, search]);

  return (
    <PlateElement {...props} as="span">
      <InlineCombobox
        element={element}
        setValue={setSearch}
        showTrigger={false}
        trigger="#"
        value={search}
      >
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 align-baseline text-xs font-medium text-primary ring-primary/30 focus-within:ring-2">
          <span>#</span>
          <InlineComboboxInput />
        </span>

        <InlineComboboxContent className="my-1.5">
          <InlineComboboxEmpty>Type a tag name</InlineComboboxEmpty>

          <InlineComboboxGroup>
            {items.map((item) => (
              <InlineComboboxItem
                key={item.key}
                onClick={() => onSelectTag(editor, item, search)}
                value={item.text}
              >
                #{item.text}
              </InlineComboboxItem>
            ))}
          </InlineComboboxGroup>
        </InlineComboboxContent>
      </InlineCombobox>

      {props.children}
    </PlateElement>
  );
}
```

**What this does:**
- `TagElement`: renders a completed tag as `#tagname` in a primary-colored pill. Adapted from `MentionElement` in `mention-node.tsx` — same structure, different styling (pill instead of muted box, `#` prefix instead of no prefix).
- `TagInputElement`: renders the combobox while the user is typing after `#`. Lists existing tags from the Zustand store. If the typed text doesn't match any existing tag, it appears as the first option (create new). Uses `getMentionOnSelectItem({ key: 'tag' })` which is the same factory the mention plugin uses, parameterized to our `'tag'` key.

- [ ] **Step 2: Replace tag-kit.tsx with MentionPlugin-based implementation**

Replace `apps/client/src/components/editor/plugins/tag-kit.tsx` entirely with:

```tsx
'use client';

import { createSlatePlugin, createTSlatePlugin, KEYS } from 'platejs';
import { toPlatePlugin } from 'platejs/react';
import { withTriggerCombobox } from '@platejs/combobox';
import { TagElement, TagInputElement } from '@/components/ui/tag-node';

export const TAG_TYPE = 'tag';
export const TAG_INPUT_TYPE = 'tag_input';

const BaseTagInputPlugin = createSlatePlugin({
  key: TAG_INPUT_TYPE,
  node: {
    isElement: true,
    isInline: true,
    isVoid: true,
  },
});

const BaseTagPlugin = createTSlatePlugin({
  key: TAG_TYPE,
  node: {
    isElement: true,
    isInline: true,
    isMarkableVoid: true,
    isVoid: true,
  },
  options: {
    trigger: '#',
    triggerPreviousCharPattern: /^$|^[\s"']$/,
    createComboboxInput: (trigger: string) => ({
      children: [{ text: '' }],
      trigger,
      type: TAG_INPUT_TYPE,
    }),
  },
  plugins: [BaseTagInputPlugin],
})
  .extendEditorTransforms(({ editor, type }) => ({
    insert: {
      mention: ({ key, value }: { key: string; value: string }) => {
        editor.tf.insertNodes({
          key,
          children: [{ text: '' }],
          type,
          value,
        });
      },
    },
  }))
  .overrideEditor(withTriggerCombobox);

export const TagPlugin = toPlatePlugin(BaseTagPlugin).withComponent(TagElement);
export const TagInputPlugin = toPlatePlugin(BaseTagInputPlugin).withComponent(TagInputElement);

export const TagKit = [TagPlugin, TagInputPlugin];
```

**What this does:**
- This is literally the MentionPlugin pattern copied from `@platejs/mention/dist/BaseMentionPlugin-uPSCCRSr.js` with:
  - Key changed from `KEYS.mention` → `'tag'`
  - Key changed from `KEYS.mentionInput` → `'tag_input'`
  - Trigger changed from `'@'` → `'#'`
  - `createComboboxInput` creates nodes with `type: TAG_INPUT_TYPE` instead of `type: KEYS.mentionInput`
  - Uses `withTriggerCombobox` from `@platejs/combobox` — the exact same editor override the MentionPlugin uses
  - `extendEditorTransforms` adds the `insert.mention` transform that `getMentionOnSelectItem` calls internally

- [ ] **Step 3: Delete the old dead tag-element.tsx**

```bash
cd /Users/devpra/repos/chronomer
rm apps/client/src/components/ui/tag-element.tsx
```

- [ ] **Step 4: Update editor-kit.tsx — remove MentionKit, update TagKit import**

Read `apps/client/src/components/editor/editor-kit.tsx`. Make these changes:

1. Remove the MentionKit import:
```tsx
// DELETE this line:
import { MentionKit } from "@/components/editor/plugins/mention-kit";
```

2. Remove `...MentionKit,` from the EditorKit array (in the Elements section).

3. The TagKit import should already be there from the previous implementation. Verify it says:
```tsx
import { TagKit } from '@/components/editor/plugins/tag-kit';
```

4. Ensure `...TagKit,` is in the EditorKit array (Elements section).

The Elements section should look like:
```tsx
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
  ...NoteBlockKit,
  ...TagKit,
```

Note: `...MentionKit,` is gone. `...TagKit,` replaces it.

- [ ] **Step 5: Verify build**

```bash
cd /Users/devpra/repos/chronomer && bun run build --filter=client 2>&1 | tail -15
```

Expected: Build succeeds. If there are import errors for `withTriggerCombobox` or `getMentionOnSelectItem`, verify:
- `@platejs/combobox` exports `withTriggerCombobox` (confirmed in `node_modules/@platejs/combobox/dist/index.d.ts`)
- `@platejs/mention` exports `getMentionOnSelectItem` (confirmed in `node_modules/@platejs/mention/dist/index.d.ts`)

If `createTSlatePlugin` is not found in `platejs`, try `createSlatePlugin` instead — the `T` variant is for typed plugins. The only difference is type inference. If it doesn't exist, use `createSlatePlugin`.

- [ ] **Step 6: Manual test — tag insertion via #**

Run: `cd /Users/devpra/repos/chronomer/apps/client && bun next dev`

Open `http://localhost:3000/notes`. Test:

1. Type some text in a block
2. Press Space, then type `#` — a combobox should appear
3. Type "project" — the dropdown should show "project" as an option
4. Click or press Enter on "project" — a styled tag pill `#project` should appear inline
5. Type more text, then `#meeting` — after selecting, both tags should be visible
6. Check the Zustand store in localStorage — the block should have `tags: ["project", "meeting"]`

If the `#` trigger doesn't fire:
- The `triggerPreviousCharPattern` requires whitespace or start-of-line before `#`. Make sure you type a space before `#`.
- Check browser console for errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/devpra/repos/chronomer
git add apps/client/src/components/editor/plugins/tag-kit.tsx \
  apps/client/src/components/ui/tag-node.tsx \
  apps/client/src/components/editor/editor-kit.tsx
git rm apps/client/src/components/ui/tag-element.tsx
git commit -m "feat: replace dead tag plugin with working MentionPlugin-based # tag system"
```

---

### Task 4: Full Integration Test

No file changes. This is manual verification of the complete flow.

- [ ] **Step 1: Clean state test**

Open browser devtools → Application → Local Storage → delete `cortex-notes-store`.
Refresh `/notes`.

- [ ] **Step 2: Create multiple blocks**

1. Type "Meeting with Sarah about auth" then press Enter, then Enter again on the empty line
2. A new block should appear. Type "Design review prep"
3. Press Enter, Enter again on empty line
4. A new block should appear. Type "Quick thought: check deployment pipeline"
5. Verify: THREE visually distinct blocks with borders, each with different content

- [ ] **Step 3: Add tags**

1. In block 1, at the end of the text, type ` #meeting` and select from dropdown
2. In block 1, type ` #project/atlas` and select from dropdown
3. In block 3, type ` #todo` and select from dropdown
4. Verify: tag pills render inline in each block

- [ ] **Step 4: Verify store**

Open localStorage → `cortex-notes-store`. Verify:
- 3 blocks with different IDs
- Block 1 has `tags: ["meeting", "project/atlas"]`
- Block 3 has `tags: ["todo"]`
- Each block has a correct `title` derived from its first text

- [ ] **Step 5: Canvas auto-population**

1. Navigate to `/canvas`
2. Verify: THREE cards appear on the canvas
3. Card 1 should show "Meeting with Sarah about auth" with tag pills `#meeting` and `#project/atlas`
4. Card 3 should show "Quick thought..." with `#todo`
5. Cards are draggable, positions persist on refresh

- [ ] **Step 6: Canvas tag filter**

1. On `/canvas`, click "By Tag"
2. Select `#meeting` from the dropdown
3. Verify: only block 1's card appears
4. Select `#todo`
5. Verify: only block 3's card appears
6. Click "Today" to go back to all blocks

- [ ] **Step 7: Block deletion**

1. Go back to `/notes`
2. Click into block 2 ("Design review prep")
3. Select all text in it and delete it
4. Now it's an empty block. Press Backspace.
5. Block 2 should disappear. 2 blocks remain.
6. Go to `/canvas` — 2 cards remain.

- [ ] **Step 8: Date navigation**

1. On `/notes`, click the left arrow to go to yesterday
2. Verify: empty journal (one empty block)
3. Type something. Navigate back to today.
4. Verify: today's blocks are still there.
5. Navigate to yesterday again — yesterday's content is still there.

- [ ] **Step 9: Commit if any fixes were made**

```bash
cd /Users/devpra/repos/chronomer
git add -A && git commit -m "fix: integration test adjustments"
```

Only commit if changes were needed.
