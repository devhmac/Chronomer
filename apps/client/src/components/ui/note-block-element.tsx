'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';
import { cn } from '@/lib/utils';

export function NoteBlockElement(props: PlateElementProps) {
  const { children, element } = props;
  const tags: string[] = (element as any).tags ?? [];

  return (
    <PlateElement
      {...props}
      className={cn(
        'relative my-3 rounded-md border border-border/40 bg-card/30 px-4 py-3',
        'first:mt-0'
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
