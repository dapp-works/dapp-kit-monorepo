import React from 'react';
import { cn } from '../../../lib/utils';
import { Card } from '@nextui-org/react';

export const PanelCard = ({ className, title, content }: { className?: string; title: React.ReactNode; content?: React.ReactNode; }) => {
  return (
    <Card className={cn('flex flex-col justify-between border-none p-4 shadow-sm', className)}>
      <p className="text-[#6B7280] dark:text-[#cecdcd] text-sm">{title}</p>
      <div className={cn('mt-2 break-all text-[#374151] dark:text-[#cecdcd] text-base font-semibold')}>{content}</div>
    </Card>
  );
};
