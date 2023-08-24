import { JSONSchemaTableState } from '../../../store/standard/JSONSchemaState';
import { ChartBox } from '../ChartBox';
import { useEffect, useState } from 'react';
import { PaginationState } from '../../../store/standard/PaginationState';
import JSONTable from '../../../components/JSONTable';

export type TableCard = ChartBox & {
  type?: 'TableCard';
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
      {table ? <JSONTable jsonstate={{ table }} className="h-[256px]" /> : <div className="h-[256px] flex justify-center items-center text-gray-400">No data</div>}
    </ChartBox>
  );
};
