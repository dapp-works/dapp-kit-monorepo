
import { Skeleton } from '@nextui-org/react';
import React from 'react';
import { cn } from '../../../lib/utils';

export interface SkeletonBox {
  line?: number;
  skClassName: string;
}

export const SkeletonBox = ({ line, skClassName, className }: SkeletonBox & { skClassName?: string; className?: string }) => {
  const lineCamp = [...new Array(line || 1).keys()];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {lineCamp.map((_, index) => {
        return (
          <Skeleton
            key={index}
            classNames={{
              base: 'transition-background !duration-700 before:transition-opacity before:!duration-700',
              content: 'transition-opacity motion-reduce:transition-none !duration-700',
            }}
            className={cn('w-full h-10', skClassName)}
          />
        );
      })}
    </div>
  );
};
