'use client';

import { createPlatePlugin } from 'platejs/react';
import { TagElement } from '@/components/ui/tag-element';

export const TAG_TYPE = 'tag';

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
