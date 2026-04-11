'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useFocused, useSelected } from 'platejs/react';
import { cn } from '@/lib/utils';

export function TagElement(props: PlateElementProps) {
  const { children, element } = props;
  const selected = useSelected();
  const focused = useFocused();
  const tagValue = (element as any).value as string;

  return (
    <PlateElement
      {...props}
      as="span"
      attributes={{
        ...props.attributes,
        contentEditable: false,
        draggable: true,
      }}
      className={cn(
        'inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary',
        'align-baseline',
        selected && focused && 'ring-2 ring-primary/30'
      )}
    >
      <span>#{tagValue}</span>
      {children}
    </PlateElement>
  );
}
