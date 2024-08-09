import { Skeleton, SlotsToClasses } from '@nextui-org/react';
import React from 'react';
import { cn } from '../../../lib/utils';

export const SkeletonBox = ({
  line,
  className,
  skClassName,
  skClassNames = {
    base: 'transition-background !duration-900 before:transition-opacity before:!duration-900',
    content: 'transition-opacity motion-reduce:transition-none !duration-900',
  }
}: {
  line?: number;
  className?: string;
  skClassName?: string;
  skClassNames?: SlotsToClasses<"base" | "content">
}) => {
  const lineCamp = [...new Array(line || 1).keys()];
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {lineCamp.map((_, index) => {
        return (
          <Skeleton
            key={index}
            className={cn('w-full h-10', skClassName)}
            classNames={skClassNames}
          />
        );
      })}
    </div>
  );
};
