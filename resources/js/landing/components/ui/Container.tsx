import { forwardRef } from 'react';
import type { ElementType, ReactNode, Ref } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

// Base layout container to keep consistent widths and padding.
export const Container = forwardRef<HTMLElement, ContainerProps<ElementType>>(
  ({ as, children, className }, ref) => {
    const Component = (as ?? 'div') as ElementType;

    return (
      <Component
        ref={ref as Ref<HTMLElement>}
        className={cn('mx-auto w-full max-w-6xl px-6', className)}
      >
        {children}
      </Component>
    );
  },
);
Container.displayName = 'Container';
