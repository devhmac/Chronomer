'use client';

import { createSlatePlugin, type SlateEditor, type Path } from 'platejs';
import { toPlatePlugin } from 'platejs/react';
import { ulid } from 'ulid';
import { NoteBlockElement } from '@/components/ui/note-block-element';

export const NOTE_BLOCK_TYPE = 'note-block';

/**
 * Check if the cursor is inside an empty paragraph that is the last child
 * of a note-block. This is the condition for "Enter exits the block."
 *
 * Requires the note-block to have at least 2 children (real content + empty
 * trailing paragraph). This means: type something, press Enter (creates empty
 * paragraph within block), press Enter again (triggers exit).
 */
function shouldExitNoteBlock(editor: SlateEditor): { noteBlockPath: Path } | null {
  if (!editor.selection) return null;

  const noteBlockEntry = editor.api.above({
    match: (n: any) => n.type === NOTE_BLOCK_TYPE,
  });
  if (!noteBlockEntry) return null;

  const [noteBlock, noteBlockPath] = noteBlockEntry;
  const children = (noteBlock as any).children ?? [];

  if (children.length < 2) return null;

  const blockEntry = editor.api.block();
  if (!blockEntry) return null;

  const [, blockPath] = blockEntry;

  const lastChildIndex = children.length - 1;
  const isLastChild = blockPath[blockPath.length - 1] === lastChildIndex;
  if (!isLastChild) return null;

  const isEmpty = editor.api.isEmpty(editor.selection, { block: true });
  if (!isEmpty) return null;

  return { noteBlockPath };
}

/**
 * Check if the cursor is in a note-block with exactly one empty child,
 * and there are other note-blocks in the document. This is the condition
 * for "Backspace deletes the empty block."
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

  if (children.length !== 1) return null;

  const isEmpty = editor.api.isEmpty(editor.selection, { block: true });
  if (!isEmpty) return null;

  const parent = editor.api.parent(noteBlockPath);
  if (!parent) return null;
  const [parentNode] = parent;
  const siblings = (parentNode as any).children ?? [];
  const noteBlockSiblings = siblings.filter((s: any) => s.type === NOTE_BLOCK_TYPE);
  if (noteBlockSiblings.length <= 1) return null;

  return { noteBlockPath };
}

/**
 * If the cursor is not inside a note-block, wrap the current block in one.
 * Called before insertText and insertFragment to ensure all content
 * entering the editor is associated with a block.
 */
function ensureInsideNoteBlock(editor: SlateEditor): void {
  if (!editor.selection) return;

  const noteBlockEntry = editor.api.above({
    match: (n: any) => n.type === NOTE_BLOCK_TYPE,
  });

  if (!noteBlockEntry) {
    const blockEntry = editor.api.block();
    if (blockEntry) {
      editor.tf.wrapNodes(
        { type: NOTE_BLOCK_TYPE, id: ulid(), tags: [], children: [] },
        { at: blockEntry[1] }
      );
    }
  }
}

const BaseNoteBlockPlugin = createSlatePlugin({
  key: NOTE_BLOCK_TYPE,
  node: {
    isElement: true,
    type: NOTE_BLOCK_TYPE,
  },
}).overrideEditor(({ editor, tf: { insertBreak, deleteBackward, insertText, insertFragment } }) => ({
  transforms: {
    insertText(text, options) {
      if (!options?.at) ensureInsideNoteBlock(editor);
      insertText(text, options);
    },

    insertFragment(fragment) {
      ensureInsideNoteBlock(editor);
      insertFragment(fragment);
    },

    insertBreak() {
      const exit = shouldExitNoteBlock(editor);

      if (exit) {
        const { noteBlockPath } = exit;

        if (editor.selection) {
          editor.tf.removeNodes({ at: editor.selection });
        }

        const newBlockId = ulid();
        const newParagraphId = ulid();
        const newNoteBlock = {
          type: NOTE_BLOCK_TYPE,
          id: newBlockId,
          tags: [],
          children: [{ type: 'p', id: newParagraphId, children: [{ text: '' }] }],
        };

        const insertPath = [
          ...noteBlockPath.slice(0, -1),
          noteBlockPath[noteBlockPath.length - 1] + 1,
        ];
        editor.tf.insertNodes(newNoteBlock, { at: insertPath });
        editor.tf.select(editor.api.start([...insertPath, 0]));

        return;
      }

      insertBreak();
    },

    deleteBackward(unit) {
      const del = shouldDeleteNoteBlock(editor);

      if (del) {
        const { noteBlockPath } = del;
        const blockIndex = noteBlockPath[noteBlockPath.length - 1];

        editor.tf.removeNodes({ at: noteBlockPath });

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

      deleteBackward(unit);
    },
  },
}));

export const NoteBlockPlugin = toPlatePlugin(BaseNoteBlockPlugin).withComponent(NoteBlockElement);

export const NoteBlockKit = [NoteBlockPlugin];
