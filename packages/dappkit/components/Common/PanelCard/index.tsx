import { cn } from '../../../lib/utils';
import { Card } from '@nextui-org/react';
import React from 'react';

export interface PanelCard {
  title: string | JSX.Element;
  content?: string | JSX.Element;
}

export const PanelCard = ({ title, content, className }: PanelCard & { className?: string }) => {
  return (
    <Card className={cn('flex flex-col justify-between border-none p-4 shadow-sm', className)}>
      <p className="text-[#6B7280] dark:text-[#cecdcd] text-sm">{title}</p>
      <div className={cn('mt-2 break-all text-[#374151] dark:text-[#cecdcd] text-base font-semibold')}>{content}</div>
    </Card>
  );
};
