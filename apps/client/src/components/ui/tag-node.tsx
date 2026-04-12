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

export function TagElement(props: PlateElementProps<TMentionElement>) {
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
          #{element.value}
        </>
      ) : (
        <>
          #{element.value}
          {props.children}
        </>
      )}
    </PlateElement>
  );
}

const onSelectTag = getMentionOnSelectItem();

export function TagInputElement(props: PlateElementProps<TComboboxInputElement>) {
  const { editor, element } = props;
  const [search, setSearch] = React.useState('');
  const allTags = useNotesStore((s) => s.getAllTags());

  const items = React.useMemo(() => {
    const existing = allTags.map((tag, i) => ({
      key: `existing-${i}`,
      text: tag,
    }));

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
