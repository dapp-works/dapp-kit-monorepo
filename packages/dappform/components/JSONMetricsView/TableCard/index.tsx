import React from 'react';
import { ChartBox } from '../ChartBox';
import JSONTable from '../../../components/JSONTable';

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
  const { data = [], columnOptions = {} } = props;

  return (
    <ChartBox {...props}>
      {data?.length > 0
        ? <JSONTable dataSource={data} columnOptions={columnOptions} className="h-[256px]" />
        : <div className="h-[256px] flex justify-center items-center text-gray-400">No data</div>
      }
    </ChartBox>
  );
};
