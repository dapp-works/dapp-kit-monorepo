import { ChartBox } from '../ChartBox';
import JSONTable from '@/dappkit/components/JSONTable';
import { useEffect, useState } from 'react';
import { JSONSchemaTableState } from '@/dappkit/store/standard/JSONSchemaState';
import { PaginationState } from '@/dappkit/store/standard/PaginationState';

export type TableCard = ChartBox & {
  type: 'TableCard';
  columnOptions?: {
    [key: string]: {
      title: string;
      hidColumn: boolean;
    }
  }
}

export const TableCard = (props: TableCard) => {
  const [table, setTable] = useState<JSONSchemaTableState | null>(null);
  const { data = [], columnOptions = {} } = props;
  useEffect(() => {
    if (data?.length > 0) {
      const table = new JSONSchemaTableState({
        columns: Object.keys(data[0])
          .filter((key) => !columnOptions[key]?.hidColumn)
          .map((key) => ({
            key,
            label: columnOptions[key]?.title || key,
          })),
        dataSource: data,
        pagination: new PaginationState({
          page: 1,
          limit: 8
        }),
        rowKey: 'id',
        className: '',
      });
      setTable(table);
    }
    return () => {
      setTable(null);
    }
  }, [data]);

  return (
    <ChartBox {...props}>
      {table && <JSONTable jsonstate={{ table }} className="h-[256px]" />}
    </ChartBox>
  );
};
