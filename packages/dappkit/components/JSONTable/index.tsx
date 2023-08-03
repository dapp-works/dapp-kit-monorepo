import React, { useEffect, useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import SimplePagination from '@/dappkit/components/Common/SimplePagination';
import { ActionButtonType, Column, ExtendedTable, JSONSchemaTableState } from '@/dappkit/store/standard/JSONSchemaState';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/dappkit/components/ui/table';
import JSONHighlight from '@/dappkit/components/Common/JSONHighlight';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { _ } from '@/dappkit/lib/lodash';
import { showDialog } from '@/dappkit/module/Dialog';
import { cn } from '@/dappkit/lib/utils';

export interface JSONTableProps<T> {
  className?: string;
  jsonstate: {
    table: JSONSchemaTableState<T>;
  };
}

const JSONTable = observer(<T,>(props: JSONTableProps<T>) => {
  const { columns, dataSource, rowKey, extendedTables = [], pagination, isServerPaging, rowOnClick } = props.jsonstate.table;

  const store = useLocalObservable<{
    sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' };
    sortedData: T[];
  }>(() => ({
    sortableColumns: {},
    sortedData: [],
  }));

  useEffect(() => {
    columns.forEach((item) => {
      if (item.sortable) {
        store.sortableColumns[item.key] = 'none';
      }
    });
  }, [columns]);

  useEffect(() => {
    store.sortedData = dataSource;
    if (!isServerPaging) {
      pagination.setData({
        total: dataSource.length,
      });
    }
  }, [dataSource]);

  const onSort = (key: string, type: 'asc' | 'desc' | 'none') => {
    Object.keys(store.sortableColumns).map((k) => {
      store.sortableColumns[k] = k === key ? type : 'none';
    });

    if (type === 'none') {
      store.sortedData = dataSource;
    } else {
      const result = _.orderBy(
        dataSource,
        (o) => {
          if (o[key] == null) {
            return type === 'desc' ? '' : o[key];
          }
          if (typeof o[key] === 'string') {
            if (isNaN(o[key])) {
              return o[key].toLowerCase();
            } else {
              return Number(o[key]);
            }
          }
          return o[key];
        },
        type
      );
      store.sortedData = result;
    }
  };

  const needExtendedTable = !!extendedTables.length;
  const data = isServerPaging ? store.sortedData : store.sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  return (
    <>
      <div className={cn('relative w-full overflow-auto h-[400px]', props.className)}>
        <Table>
          <TableHeader className='sticky top-0'>
            <TableRow className="bg-gray-100 dark:bg-gray-900">
              {needExtendedTable && <TableHead></TableHead>}
              {columns.map((item) => (
                <TableHead className="font-bold text-sm" key={item.key}>
                  <div className='flex items-center'>
                    <div>{item.label}</div>
                    {store.sortableColumns[item.key] === 'asc' && <ChevronUp className='ml-1 cursor-pointer' size={20} onClick={() => { onSort(item.key, 'desc') }} />}
                    {store.sortableColumns[item.key] === 'desc' && <ChevronDown className='ml-1 cursor-pointer' size={20} onClick={() => { onSort(item.key, 'none') }} />}
                    {store.sortableColumns[item.key] === 'none' && <ChevronsUpDown className='ml-1 cursor-pointer' size={20} onClick={() => { onSort(item.key, 'asc') }} />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) =>
              needExtendedTable ? (
                <CollapseBody key={item[rowKey] || index} item={item} columns={columns} extendedTables={extendedTables} />
              ) : (
                <Body key={item[rowKey] || index} item={item} columns={columns} rowOnClick={rowOnClick} />
              ),
            )}
          </TableBody>
        </Table>
      </div>
      <SimplePagination
        className="mt-4"
        total={pagination.total}
        limit={pagination.limit}
        page={pagination.page}
        onPageChange={(currentPage) => {
          pagination.setData({
            page: currentPage,
          });
        }}
      />
    </>
  );
});

function ActionButton({ props, text }: ActionButtonType) {
  return <Button {...props}>{text}</Button>;
}

function renderFieldValue(v: any) {
  if (typeof v == 'string' || typeof v == 'number') {
    return v;
  }
  if (v == null) {
    return null;
  }
  return (
    <p
      className='cursor-pointer'
      onClick={(e) => {
        e.stopPropagation();
        showDialog({
          content: <JSONHighlight className='w-full lg:w-[900px]' jsonStr={JSON.stringify(v, null, 2)} />,
        })
      }}
    >
      {JSON.stringify(v).slice(0, 50) + '...'}
    </p>
  )
}

function Body<T>({ item, columns, rowOnClick }: { item: T; columns: Column<T>[]; rowOnClick?: (item: T) => void }) {
  return (
    <TableRow
      className="text-sm"
      onClick={() => {
        if (rowOnClick) {
          rowOnClick(item);
        }
      }}
    >
      {columns.map((column) => {
        return (
          <TableCell key={column.key} className="max-w-[200px] border-b border-solid border-[#F5F5F5] overflow-x-auto dark:border-gray-700">
            {column.actions
              ? column.actions(item).map((btn, index) => <ActionButton key={index} props={btn.props} text={btn.text} />)
              : column.render
                ? column.render(item)
                : renderFieldValue(item[column.key])}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

function CollapseBody<T>({ item, columns, extendedTables }: { item: T; columns: Column<T>[]; extendedTables: ExtendedTable<any>[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TableRow
        className="text-sm cursor-pointer"
        onClick={(e: any) => {
          const { nodeName } = e.target;
          if (nodeName === 'TD' || nodeName === 'svg') {
            setIsOpen((v) => !v);
          }
        }}
      >
        <TableCell className="w-10">{isOpen ? <ChevronDown size={30} /> : <ChevronRight size={30} />}</TableCell>
        {columns.map((column) => {
          return (
            <TableCell key={column.key} className="max-w-[200px] border-b border-solid border-[#F5F5F5] overflow-x-auto dark:border-gray-700">
              {column.actions
                ? column.actions(item).map((btn, index) => <ActionButton key={index} props={btn.props} text={btn.text} />)
                : column.render
                  ? column.render(item)
                  : renderFieldValue(item[column.key])}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow className={cn(isOpen ? 'table-row' : 'hidden')}>
        <TableCell></TableCell>
        <TableCell colSpan={columns.length}>
          {extendedTables.map((ex) => {
            const exColumns = ex.columns;
            const exRow = item[ex.key];
            return (
              <Table className="mt-[10px]" key={ex.key}>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-800">
                    {exColumns.map((exC) => {
                      return (
                        <TableHead key={exC.key} className="font-bold text-sm">
                          {exC.label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exRow.map((exItem) => (
                    <TableRow className="text-sm" key={exItem.key}>
                      {exColumns.map((exC) => {
                        return (
                          <TableCell key={exC.key} className="max-w-[200px] border-b border-solid border-[#F5F5F5] overflow-x-auto dark:border-gray-700">
                            {exC.actions
                              ? exC.actions(exItem).map((btn, index) => <ActionButton key={index} props={btn.props} text={btn.text} />)
                              : exC.render
                                ? exC.render(exItem)
                                : renderFieldValue(exItem[exC.key])}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            );
          })}
        </TableCell>
      </TableRow>
    </>
  );
}

export default JSONTable;
