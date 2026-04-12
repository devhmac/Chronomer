'use client';

import { MentionInputPlugin, MentionPlugin } from '@platejs/mention/react';
import { TagElement, TagInputElement } from '@/components/ui/tag-node';

// These match MentionPlugin's internal keys since we're reusing it
export const TAG_TYPE = 'mention';
export const TAG_INPUT_TYPE = 'mention_input';

// Reuse MentionPlugin directly with # trigger and custom keys.
// MentionPlugin already has withTriggerCombobox wired up internally.
export const TagPlugin = MentionPlugin.configure({
  options: {
    trigger: '#',
    triggerPreviousCharPattern: /^$|^[\s"']$/,
  },
}).withComponent(TagElement);

export const TagInputPlugin = MentionInputPlugin.withComponent(TagInputElement);

export const TagKit = [TagPlugin, TagInputPlugin];
