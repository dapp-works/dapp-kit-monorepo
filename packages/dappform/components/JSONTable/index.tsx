"use client";

import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import JSONHighlight from "../../components/Common/JSONHighlight";
import { Button, ButtonProps, Pagination as NextuiPagination } from '@nextui-org/react';
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";
import { _ } from "../../lib/lodash";
import { showDialog } from "../../module/Dialog";
import { cn } from "../../lib/utils";
import { PaginationState } from "../../store/standard/PaginationState";

export type ActionButtonType = {
  props?: ButtonProps;
  children: React.ReactNode;
};

export type ColumnOptions<T = { [x: string]: any }> = {
  [key in keyof T]?: {
    label?: string;
    hidden?: boolean;
    sortable?: boolean;
    order?: number;
    render?: (item: T) => any;
  };
}

export type Column<T = { [x: string]: any }> = {
  key: string;
  label: string;
  render?: (item: T) => any;
};

export type ExtendedTable<U> = {
  key: string;
  columns: Column<U>[];
};

export type ActionsType<T> = (item: T) => ActionButtonType[] | React.ReactNode;

export interface JSONTableProps<T = { [x: string]: any }> {
  className?: string;
  dataSource: T[];
  columnOptions?: ColumnOptions<T>;
  isServerPaging?: boolean;
  extendedTableOptions?: {
    key: string;
    columnOptions?: ColumnOptions<any>;
    // actions?: (item: any) => ActionButtonType[];
  }[];
  rowKey?: string;
  pagination?: PaginationState;
  onRowClick?: (item: T) => void;
  actions?: ActionsType<T>;
  actionsOptions?: {
    headLabel?: string;
    placement?: 'left' | 'right';
  };
}

const JSONTable = observer(<T extends {},>(props: JSONTableProps<T>) => {
  const {
    dataSource,
    columnOptions,
    isServerPaging,
    pagination = new PaginationState({
      page: 1,
      limit: 8,
    }),
    extendedTableOptions = [],
    rowKey = 'id',
    onRowClick,
    actions,
    actionsOptions,
  } = props;

  const actionsHeadLabel = actionsOptions?.headLabel || '';
  const actionsPlacement = actionsOptions?.placement || 'right';

  const store = useLocalObservable<{
    columns: Column<T>[],
    sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' };
    sortedData: T[];
    extendedTables: ExtendedTable<any>[];
  }>(() => ({
    columns: [],
    sortableColumns: {},
    sortedData: [],
    extendedTables: [],
  }));

  useEffect(() => {
    store.sortedData = dataSource;
    if (!isServerPaging) {
      pagination.setData({
        total: dataSource.length,
      });
    }
    if (dataSource?.length > 0) {
      const _keys = columnOptions ? Object.keys(dataSource[0]).filter(key => !columnOptions[key]?.hidden) : Object.keys(dataSource[0]);
      const columns: Column<T>[] = _keys
        .map((key) => {
          const sortable = columnOptions?.[key]?.sortable;
          if (sortable) {
            store.sortableColumns[key] = 'none';
          }
          return ({
            key,
            label: columnOptions?.[key]?.label || key,
            render: columnOptions?.[key]?.render,
          });
        })
        .sort((a, b) => {
          const aOrder = columnOptions?.[a.key]?.order || 0;
          const bOrder = columnOptions?.[b.key]?.order || 0;
          return bOrder - aOrder;
        });
      store.columns = columns;
    }
  }, [dataSource, columnOptions]);

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
        type,
      );
      store.sortedData = result;
    }
  };

  const { columns, extendedTables } = store;
  const needExtendedTable = !!extendedTables.length;
  const data = isServerPaging ? store.sortedData : store.sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  return (
    <>
      <div className={cn('relative w-full overflow-auto h-[400px]', props.className)}>
        <Table>
          <TableHeader className="sticky top-0">
            <TableRow className="bg-[#F4F4F5] dark:bg-[#3F3F45] shadow-sm">
              {needExtendedTable && <TableHead></TableHead>}
              {actionsPlacement === 'left' && <TableHead className="font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300">{actionsHeadLabel}</TableHead>}
              {columns.map((item, index) => (
                <TableHead className={`font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300`} key={item.key}>
                  <div className="flex items-center">
                    <div className="text-xs">{item.label}</div>
                    {store.sortableColumns[item.key] === 'asc' && (
                      <ChevronUp
                        className="ml-1 cursor-pointer"
                        size={14}
                        onClick={() => {
                          onSort(item.key, 'none');
                        }}
                      />
                    )}
                    {store.sortableColumns[item.key] === 'desc' && (
                      <ChevronDown
                        className="ml-1 cursor-pointer"
                        size={14}
                        onClick={() => {
                          onSort(item.key, 'asc');
                        }}
                      />
                    )}
                    {store.sortableColumns[item.key] === 'none' && (
                      <ChevronsUpDown
                        className="ml-1 cursor-pointer"
                        size={14}
                        onClick={() => {
                          onSort(item.key, 'desc');
                        }}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
              {actionsPlacement === 'right' && <TableHead className="font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300">{actionsHeadLabel}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) =>
              needExtendedTable ? (
                <CollapseBody key={item[rowKey] || index} item={item} columns={columns} extendedTables={extendedTables} />
              ) : (
                <Body key={item[rowKey] || index} item={item} columns={columns} onRowClick={onRowClick} actions={actions} actionsPlacement={actionsPlacement} />
              ),
            )}
          </TableBody>
        </Table>
      </div>
      {pagination.total > pagination.limit && (
        <div className="flex justify-center h-[30px] mt-4">
          <NextuiPagination
            showControls
            size="sm"
            radius="sm"
            total={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            initialPage={1}
            onChange={(currentPage) => {
              pagination.setData({
                page: currentPage,
              });
            }}
          />
        </div>
      )}
    </>
  );
});

function ActionButton({ props, children }: ActionButtonType) {
  return <Button {...props}>{children}</Button>;
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
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        showDialog({
          content: <JSONHighlight className="w-full lg:w-[900px]" jsonStr={JSON.stringify(v, null, 2)} />,
        });
      }}
    >
      {JSON.stringify(v).slice(0, 50) + '...'}
    </p>
  );
}

function Actions<T>({ actions, item }: { item: T; actions?: ActionsType<T> }) {
  if (!actions) {
    return null;
  }

  const Com = actions(item);
  if (Array.isArray(Com)) {
    return (
      <TableCell className="max-w-[200px] overflow-auto space-x-2">
        {Com.map((btn, index) => (
          <ActionButton key={index} props={btn.props} children={btn.children} />
        ))}
      </TableCell>
    );
  }

  return <TableCell className="max-w-[200px] overflow-auto space-x-2">{Com}</TableCell>;
}

function Body<T>({
  item,
  columns,
  onRowClick,
  actions,
  actionsPlacement
}: {
  item: T;
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  actions?: ActionsType<T>;
  actionsPlacement: 'left' | 'right';
}) {
  return (
    <TableRow
      className="text-[13px] hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]"
      onClick={() => {
        onRowClick?.(item);
      }}
    >
      {actionsPlacement === 'left' && <Actions item={item} actions={actions} />}
      {columns.map((column) => {
        return (
          <TableCell key={column.key} className="max-w-[200px] overflow-auto">
            {column.render
              ? column.render(item)
              : renderFieldValue(item[column.key])}
          </TableCell>
        );
      })}
      {actionsPlacement === 'right' && <Actions item={item} actions={actions} />}
    </TableRow>
  );
}

function CollapseBody<T>({ item, columns, extendedTables }: { item: T; columns: Column<T>[]; extendedTables: ExtendedTable<any>[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TableRow
        className="text-[13px] cursor-pointer"
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
            <TableCell key={column.key} className="max-w-[200px] overflow-auto">
              {column.render
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
                  <TableRow className="bg-[#F4F4F5] dark:bg-[#3F3F45]">
                    {exColumns.map((exC) => {
                      return (
                        <TableHead key={exC.key} className="font-bold text-sm dark:text-gray-300">
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
                          <TableCell key={exC.key} className="max-w-[200px] overflow-auto">
                            {exC.render
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
export { JSONTable }