# Daily Notes + Canvas POC Design

**Date:** 2026-04-11
**Status:** Approved
**Goal:** Proof-of-concept for a daily notes stream with block-based structure that auto-populates a spatial canvas. Validate the UX before building the full Tauri/Rust/SQLite native app.

---

## Context

Chronomer already has a Plate.js rich text editor on `/notes` and a tldraw canvas on `/canvas`. They're isolated — no shared data model, no bridge between writing and spatial views. This POC connects them through a block-based data model stored in Zustand.

The long-term vision (documented in `pivot-notes-initial.md`) describes a PKM app with three layers: daily stream, knowledge graph, and spatial canvas. This POC validates the first and third layers with a lightweight implementation.

---

## Data Model

Zustand store with localStorage persistence. Three concepts, two stored entities:

### Block

```ts
type Block = {
  id: string              // ULID
  content: Value          // Plate editor Value (rich content tree)
  title: string           // Derived from first text node, for canvas display
  date: string            // YYYY-MM-DD, which daily journal this belongs to
  tags: string[]          // e.g. ["project/atlas", "meeting"]
  createdAt: string       // ISO8601
  updatedAt: string       // ISO8601
  canvasPosition?: {      // Persisted position if placed on canvas
    x: number
    y: number
  }
}
```

### DailyJournal

Not a separate entity. Derived by querying blocks where `date === targetDate`, ordered by `createdAt`. The daily journal page filters the store by date.

### CanvasState

tldraw manages its own persistence via `persistenceKey`. The bridge between store and canvas is:
- Blocks are rendered as custom tldraw shapes
- `canvasPosition` on the block tracks where the user placed it
- tldraw's native arrow/connector state lives in tldraw's own store

---

## Editor Behavior

### Document Structure

The daily journal is one continuous Plate editor. The document is a flat list of `note-block` wrapper nodes — a custom Plate element type.

```
Editor root
├── note-block (id: "01HXY...")     <- Block 1
│   ├── p "Meeting with Sarah about auth"
│   ├── p "She wants OAuth2 instead of SAML"
│   ├── code_block [javascript]
│   └── p "Timeline: end of Q2"
│
├── note-block (id: "01HXZ...")     <- Block 2
│   └── p "Pick up groceries"
│
├── note-block (id: "01HXZ...")     <- Block 3
│   ├── p "Design token audit"
│   ├── p "The accent color in dark mode..."
│   └── img [screenshot.png]
```

Each `note-block` wraps arbitrary Plate content. Inside a `note-block`, all standard Plate features work: paragraphs, headings, code blocks, images, lists, callouts, slash commands, formatting, etc.

The `note-block` node carries the block ID and serves as the sync boundary with the Zustand store.

### Keyboard Behavior

- **Opening today's journal:** If no blocks exist for today, one empty `note-block` is created. Cursor starts inside it.
- **Inside a block:** Standard Plate editing. Enter creates new paragraphs, Tab indents lists, slash commands work, all formatting works. Nothing unusual.
- **Creating a new block:** Enter twice on an empty line at the end of a block exits it and creates a new `note-block` below. Same pattern as exiting a blockquote or code block — familiar behavior.
- **Deleting a block:** Backspace on an empty block deletes it and moves the cursor into the previous block.

### Visual Treatment

Each `note-block` has subtle visual separation:
- Vertical gap between blocks
- Faint left border or slight background differentiation
- Enough to see "these are distinct units" but not so heavy it feels like separate editors
- Tags render as small pills at the top-right or bottom of each block

### Store Sync

On editor change (debounced), walk the Plate document tree:
1. Extract each `note-block` and its children
2. Derive title from the first text content
3. Sync to the Zustand store (create/update/delete blocks)
4. The Plate editor is source of truth for content while editing
5. The store is source of truth for "what blocks exist" across pages

### Tagging

- Type `#` inside a block to trigger tag autocomplete (similar to existing mention plugin pattern)
- Selecting a tag adds it to the block's `tags` array in the store
- Tag renders inline as a styled pill
- Tags are simple strings for the POC — no schemas, no enforced hierarchy
- String convention for nesting: `"project/atlas"` is just a string

---

## Canvas

### Custom Shape: NoteCardShape

A custom tldraw shape that renders a block. Displays:
- Block title (first line, prominent)
- Content preview (truncated body, 2-3 lines)
- Tag pills if the block has tags
- Card treatment: border, background, rounded corners

This is a **read-only preview**, not a live Plate editor instance. Clicking a card navigates to that block in the daily editor. Inline canvas editing is out of scope.

### Auto-Population

Blocks appear on the canvas automatically based on a filter. Two modes for the POC:

1. **Today's blocks** (default) — all blocks from today's daily journal
2. **By tag** — filter selector at top of canvas, pick a tag, see all matching blocks

### Layout

- Blocks without a `canvasPosition` get auto-laid out in a grid/column arrangement
- Once dragged, position saves back to the block's `canvasPosition` in the store
- Positioned blocks persist their location across page loads
- New blocks get placed in the next available slot

### Connections

- tldraw's native arrow/connector tools work between note cards out of the box
- Connections are visual only — stored in tldraw's persistence, not as graph edges in Zustand
- Graph-level edge storage is deferred to the full app

---

## Zustand Store Shape

```ts
interface NotesStore {
  blocks: Record<string, Block>

  // Block CRUD
  createBlock: (date: string, content?: Value) => string  // returns new block ID
  updateBlock: (id: string, updates: Partial<Block>) => void
  deleteBlock: (id: string) => void

  // Queries
  getBlocksByDate: (date: string) => Block[]
  getBlocksByTag: (tag: string) => Block[]
  getAllTags: () => string[]

  // Canvas
  updateCanvasPosition: (id: string, position: { x: number; y: number }) => void

  // Sync from editor
  syncFromEditor: (date: string, noteBlocks: NoteBlockData[]) => void
}
```

Persisted to localStorage via Zustand `persist` middleware.

---

## Pages & Routing

- `/notes` (or `/daily`) — Daily journal editor. Date selector to navigate days. Default: today.
- `/canvas` — Canvas view with auto-populated blocks. Filter controls for date/tag.
- Sidebar updated: "Daily Journal" links to `/notes`, "Canvas" links to `/canvas`.

---

## Out of Scope (POC)

- Inline editing on canvas
- Graph edges as stored entities
- Tag schemas / supertags
- Block-to-block linking (`[[wiki-links]]`)
- Search / command palette over blocks
- Multi-canvas support
- Backend / API / database
- Block archiving
- Collaborative editing
