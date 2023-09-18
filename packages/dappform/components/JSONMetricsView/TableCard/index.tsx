import React from 'react';
import { showDialog } from '../../../module/Dialog';
import JSONHighlight from '../../Common/JSONHighlight';
import { TableDataEditor } from '../../TableDataEditor';
import { ChartBox } from '../ChartBox';

export type TableCard = ChartBox & {
  type?: 'TableCard';
  columnOptions?: {
    [key: string]: {
      title: string;
      hidden: boolean;
    }
  }
}

export const TableCard = (props: TableCard) => {
  const { data = [], columnOptions = {} } = props;

  return (
    <ChartBox {...props}>
      {data?.length > 0
        ? <TableDataEditor
          height={310}
          data={data}
          columnOptions={columnOptions}
          onCellClicked={(d) => {
            if (d != null && typeof d == 'object') {
              showDialog({
                content: <JSONHighlight className="w-full lg:w-[900px]" jsonStr={JSON.stringify(d, null, 2)} />
              });
            }
          }}
        />
        : <div className="h-[310px] flex justify-center items-center text-gray-400">No data</div>}
    </ChartBox>
  );
};
