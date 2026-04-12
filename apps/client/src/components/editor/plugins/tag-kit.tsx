'use client';

import { createSlatePlugin, createTSlatePlugin } from 'platejs';
import { toPlatePlugin } from 'platejs/react';
import { withTriggerCombobox, type TriggerComboboxPluginOptions } from '@platejs/combobox';
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

// Use the same pattern as BaseMentionPlugin from @platejs/mention.
// The key difference: we cast withTriggerCombobox to `any` to avoid
// a type mismatch between the extended transforms config and the
// TriggerComboboxPluginOptions expected by withTriggerCombobox.
// This is safe because the runtime behavior is identical — the types
// just don't chain cleanly across extendEditorTransforms + overrideEditor.
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
  } as TriggerComboboxPluginOptions,
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
  .overrideEditor(withTriggerCombobox as any);

export const TagPlugin = toPlatePlugin(BaseTagPlugin).withComponent(TagElement);
export const TagInputPlugin = toPlatePlugin(BaseTagInputPlugin).withComponent(TagInputElement);

export const TagKit = [TagPlugin, TagInputPlugin];
