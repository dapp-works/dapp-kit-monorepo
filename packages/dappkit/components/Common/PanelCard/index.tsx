import { cn } from '../../../lib/utils';
import { Card } from '@nextui-org/react';
import React from 'react';

export interface PanelCard {
  title: string | JSX.Element;
  content?: string | JSX.Element;
}

export const PanelCard = ({ title, content, className }: PanelCard & { className?: string }) => {
  return (
    <Card className={cn('border-none shadow-none bg-[#F8FAFC] dark:bg-[#18181c] p-4', className)} shadow="sm">
      <p className="text-[#6B7280] text-sm">{title}</p>
      <div className={cn('break-all text-[#374151] text-base font-semibold mt-2', className)}>{content}</div>
    </Card>
  );
};
