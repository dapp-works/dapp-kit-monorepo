import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/dappkit/components/ui/card';
import { cn } from '@/dappkit/lib/utils';
import { HardDrive } from 'lucide-react';

export interface ChartBox {
  title: string | JSX.Element;
  description?: string;
  loading?: boolean;
  error?: string;
  data?: {
    [key: string]: any;
  }[];
  children?: JSX.Element;
  gridH?: number; // grid units, not pixels
}

export const CustomCardTitle = ({ children }: { children: string | JSX.Element }) => {
  if (typeof children === 'string') {
    return <CardTitle>{children}</CardTitle>
  }
  return <>{children}</>;
}

export const ChartBox = ({ title, description, error, data = [], children, className }: ChartBox & { className?: string }) => {
  return (
    <Card className={cn('dark:border-gray-800', className)}>
      <CardHeader className='p-4 h-[60px]'>
        <CustomCardTitle>{title}</CustomCardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-2 pb-5">
        {error && <div className="text-red-500">{error}</div>}
        {!error && data?.length === 0 && (
          <div className="min-h-[100px] flex flex-col items-center justify-center">
            <HardDrive />
            <div>No data to show</div>
          </div>
        )}
        {!error && data?.length > 0 && children}
      </CardContent>
    </Card>
  );
};
