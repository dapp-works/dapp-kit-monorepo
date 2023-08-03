import { observer } from 'mobx-react-lite';
import { Select, SelectItem } from '@tremor/react';
import { cn } from '@/dappkit/lib/utils';

export interface TimeRangePick {
  type: 'TimeRangePick';
  className?: string;
  value: any;
  onChange: (step: TimeRange) => void;
}

export enum TimeRange {
  hours = 'hours',
  days = 'days',
  weeks = 'weeks',
  months = 'months',
}

export const TimeRangePick = observer(({ value, className, onChange }: TimeRangePick) => {
  return (
    <div className={cn('max-w-sm  space-y-3', className)}>
      <Select
        className="w-4"
        defaultValue={value}
        onValueChange={(v) => {
          onChange(v as TimeRange);
        }}
      >
        <SelectItem value="hours">Hourly</SelectItem>
        <SelectItem value="days">Daily</SelectItem>
        <SelectItem value="weeks">Weekly</SelectItem>
        <SelectItem value="months">Monthly</SelectItem>
      </Select>
    </div>
  );
});
