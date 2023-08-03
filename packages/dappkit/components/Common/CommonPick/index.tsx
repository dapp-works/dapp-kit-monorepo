import { observer } from 'mobx-react-lite';
import { Select, SelectItem } from '@tremor/react';
import { cn } from '@/dappkit/lib/utils';

export interface CommonPick {
  className?: string;
  value: any;
  data: { label: string; value: any }[];
  placeholder?: string;
  onChange: (v: any) => void;
}

export const CommonPick = observer(({ placeholder, value, className, onChange, data }: CommonPick) => {
  return (
    <div className={cn('max-w-sm  space-y-3')}>
      <Select
        className={cn('w-8', className)}
        defaultValue={value}
        onValueChange={(v) => {
          onChange(v);
        }}
        placeholder={placeholder}
      >
        {data?.map((i) => {
          return (
            <SelectItem value={i.value} key={i.label}>
              {i.label}
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
});
