import React from 'react';
import { cn } from '../../../lib/utils';
import { Card } from '@nextui-org/react';

export interface ChartBox {
  title?: React.ReactNode;
  description?: string;
  error?: string;
  data?: {
    [key: string]: any;
  }[];
  children?: React.ReactNode;
  gridH?: number; // grid units, not pixels
  numColSpanMd?: number;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  chartClassName?: string;
}

export const ChartBox = ({ title, description, error, children, className, headerClassName, contentClassName }: ChartBox) => {
  return (
    <Card className={cn('dark:border-gray-800 shadow-sm border', className)}>
      {(title || description) && (
        <div className={cn('p-4 h-[60px]', headerClassName)}>
          {title && <div>{title}</div>}
          {description && <div className="text-xs">{description}</div>}
        </div>
      )}
      <div className={cn('px-2 pb-5', contentClassName)}>{error ? <div className="text-red-600">{error}</div> : children}</div>
    </Card>
  );
};
