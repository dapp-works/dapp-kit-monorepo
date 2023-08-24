import { cn } from '../../../lib/utils';
import { Card, Skeleton, Spinner } from '@nextui-org/react';

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
}

export const ChartBox = ({ title, description, error, children, className }: ChartBox) => {
  return (
    <Card className={cn('dark:border-gray-800', className)} shadow='sm'>
      <div className='p-4 h-[60px]'>
        <div>{title}</div>
        {description && <div className='text-xs'>{description}</div>}
      </div>
      <div className="px-2 pb-5">
        {error ? <div className="text-red-600">{error}</div> : children}
      </div>
    </Card>
  );
};
