import React from 'react';
import { ChartBox } from '../ChartBox';
import JSONTable from '../../JSONTable';
import { cn } from '../../../lib/utils';

export type TableCard = ChartBox & {
  type?: 'TableCard';
  columnOptions?: {
    [key: string]: {
      label: string;
      hidden: boolean;
    }
  }
}

export const TableCard = (props: TableCard) => {
  const { data = [], columnOptions = {}, chartClassName } = props;
  return (
    <ChartBox {...props}>
      {data?.length > 0
        ? <JSONTable dataSource={data} columnOptions={columnOptions} className={cn("h-[256px]", chartClassName)} />
        : <div className={cn("h-[256px] flex justify-center items-center text-gray-400", chartClassName)}>No data</div>
      }
    </ChartBox>
  );
};
