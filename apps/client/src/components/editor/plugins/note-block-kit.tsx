'use client';

import { createPlatePlugin } from 'platejs/react';
import { NoteBlockElement } from '@/components/ui/note-block-element';

export const NOTE_BLOCK_TYPE = 'note-block';

export const NoteBlockPlugin = createPlatePlugin({
  key: NOTE_BLOCK_TYPE,
  node: {
    isElement: true,
    type: NOTE_BLOCK_TYPE,
  },
}).withComponent(NoteBlockElement);

export const NoteBlockKit = [NoteBlockPlugin];
