"use client";

import React, { useEffect, useMemo, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import JSONHighlight from "../Common/JSONHighlight";
import { Button, ButtonProps, Card, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination as NextuiPagination } from '@nextui-org/react';
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";
import { _ } from "../../lib/lodash";
import { DialogStore } from "../../module/Dialog";
import { cn } from "../../lib/utils";
import { PaginationState } from "../../store/standard/PaginationState";
import { v4 as uuid } from 'uuid';

export type ActionButtonType = {
  props?: ButtonProps;
  children: React.ReactNode;
};

export type ActionsOptions = {
  headLabel?: string;
  placement?: 'left' | 'right';
  className?: string;
};

export type ColumnOptions<T = { [x: string]: any }> = {
  [key in keyof T]?: {
    label?: React.ReactNode;
    hidden?: boolean;
    sortable?: boolean;
    sortKey?: string;
    order?: number;
    render?: (item: T) => any;
    thClassName?: string;
    tdClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
  };
};

export type Column<T = { [x: string]: any }> = {
  key: string;
  label: React.ReactNode;
  render?: (item: T) => any;
};

export type ExtendedTable<U> = {
  key: string;
  columns: Column<U>[];
};

export type ActionsType<T> = (item: T) => ActionButtonType[] | React.ReactNode;

export type CardOptions = {
  boxClassName?: string;
  cardClassName?: string;
  itemClassName?: string;
  showDivider?: boolean;
  dividerClassName?: string;
};

export interface JSONTableProps<T = { [x: string]: any }> {
  className?: string;
  dataSource: T[];
  columnOptions?: ColumnOptions<T>;
  headerKeys?: string[];
  isServerPaging?: boolean;
  extendedTableOptions?: {
    key: string;
    columnOptions?: ColumnOptions<any>;
    // actions?: (item: any) => ActionButtonType[];
  }[];
  rowKey?: string;
  pagination?: PaginationState;
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  actions?: ActionsType<T>;
  actionsOptions?: ActionsOptions;
  asCard?: boolean;
  cardOptions?: CardOptions;
  autoScrollToTop?: boolean;
}

const JSONTable = observer(<T extends {},>(props: JSONTableProps<T>) => {
  const {
    dataSource,
    columnOptions,
    headerKeys,
    isServerPaging,
    pagination = new PaginationState({
      page: 1,
      limit: 8,
    }),
    extendedTableOptions = [],
    rowKey = 'id',
    onRowClick,
    rowCss,
    actions,
    actionsOptions,
    asCard = false,
    cardOptions = {
      boxClassName: '',
      cardClassName: '',
      itemClassName: '',
      showDivider: true,
      dividerClassName: '',
    },
    autoScrollToTop = false,
  } = props;

  const actionsHeadLabel = actionsOptions?.headLabel || '';
  const actionsPlacement = actions ? actionsOptions?.placement || 'right' : undefined;

  const store = useLocalObservable<{
    columns: Column<T>[],
    sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' };
    sortedData: T[];
    extendedTables: ExtendedTable<any>[];
    setData: (data: Partial<typeof store>) => void;
  }>(() => ({
    columns: [],
    sortableColumns: {},
    sortedData: [],
    extendedTables: [],
    setData(data: Partial<typeof store>) {
      Object.assign(store, data);
    },
  }));

  useEffect(() => {
    const _keys = dataSource.length > 0 ? Object.keys(dataSource[0]) : [];
    const keys = headerKeys ? headerKeys : columnOptions ? _keys.filter((key) => !columnOptions[key]?.hidden) : _keys;
    const sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' } = {};
    const columns: Column<T>[] = keys
      .map((key) => {
        const sortable = columnOptions?.[key]?.sortable;
        if (sortable) {
          sortableColumns[key] = 'none';
        }
        return {
          key,
          label: columnOptions?.[key]?.label || key,
          render: columnOptions?.[key]?.render,
          className: columnOptions?.[key]?.className,
        };
      })
      .sort((a, b) => {
        const aOrder = columnOptions?.[a.key]?.order || 0;
        const bOrder = columnOptions?.[b.key]?.order || 0;
        return bOrder - aOrder;
      });
    store.setData({
      sortableColumns,
      columns,
      sortedData: dataSource,
    });
    if (!isServerPaging) {
      pagination.setData({
        total: dataSource.length,
      });
    }
  }, [dataSource, columnOptions]);

  const onSort = ({ sortKey, key, type }: { sortKey: string; key: string; type: 'asc' | 'desc' | 'none' }) => {
    const sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' } = {};
    Object.keys(store.sortableColumns).map((k) => {
      sortableColumns[k] = k === key ? type : 'none';
    });

    let sortedData = dataSource;
    if (type !== 'none') {
      const result = _.orderBy(
        dataSource,
        (o) => {
          const v = _.get(o, sortKey || key);
          if (v == null) {
            return type === 'desc' ? '' : v;
          }
          if (typeof v === 'string') {
            const _v = Number(v);
            if (isNaN(_v)) {
              return v.toLowerCase();
            } else {
              return _v;
            }
          }
          return v;
        },
        type,
      );
      sortedData = result;
    }

    store.setData({
      sortableColumns,
      sortedData,
    });
  };

  const { columns, extendedTables } = store;
  const needExtendedTable = !!extendedTables.length;
  const data = isServerPaging ? store.sortedData : store.sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  const tableBoxElementId = useMemo(() => {
    return autoScrollToTop ? `table-card-${uuid().slice(0, 8)}` : undefined;
  }, []);

  if (asCard) {
    return (
      <CardOnMobile
        className={props.className}
        data={data}
        columns={columns}
        columnOptions={columnOptions}
        actions={actions}
        actionsOptions={actionsOptions}
        cardOptions={cardOptions}
        pagination={pagination}
        onRowClick={onRowClick}
        tableBoxElementId={tableBoxElementId}
      />
    );
  }

  return (
    <>
      <div className={cn('relative w-full overflow-auto h-[400px]', props.className)} id={tableBoxElementId}>
        <Table>
          <TableHeader className="sticky top-0">
            <TableRow className="bg-[#F4F4F5] dark:bg-[#3F3F45] shadow-sm">
              {needExtendedTable && <TableHead></TableHead>}
              {actionsPlacement === 'left' && <TableHead className="font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300">{actionsHeadLabel}</TableHead>}
              {columns.map((item, index) => (
                <TableHead className={cn('font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300', columnOptions?.[item.key]?.thClassName)} key={item.key}>
                  <div className="flex items-center">
                    <div className="text-xs">{item.label}</div>
                    {!!store.sortableColumns[item.key] && (
                      <Dropdown
                        showArrow
                        backdrop="opaque"
                        placement="bottom"
                      >
                        <DropdownTrigger>
                          <div className="cursor-pointer">
                            {store.sortableColumns[item.key] === 'desc' && <ChevronDown size={14} />}
                            {store.sortableColumns[item.key] === 'asc' && <ChevronUp size={14} />}
                            {store.sortableColumns[item.key] === 'none' && <ChevronsUpDown size={14} />}
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu selectionMode="single" selectedKeys={[store.sortableColumns[item.key]]}>
                          <DropdownItem
                            key="asc"
                            onClick={() => {
                              onSort({
                                type: 'asc',
                                key: item.key,
                                sortKey: columnOptions?.[item.key]?.sortKey,
                              });
                            }}
                          >
                            <span className="text-sm font-bold">Sort ascending</span>
                          </DropdownItem>
                          <DropdownItem
                            key="desc"
                            onClick={() => {
                              onSort({
                                type: 'desc',
                                key: item.key,
                                sortKey: columnOptions?.[item.key]?.sortKey,
                              });
                            }}
                          >
                            <span className="text-sm font-bold">Sort descending</span>
                          </DropdownItem>
                          <DropdownItem
                            key="none"
                            onClick={() => {
                              onSort({
                                type: 'none',
                                key: item.key,
                                sortKey: columnOptions?.[item.key]?.sortKey,
                              });
                            }}
                          >
                            <span className="text-sm font-bold">Sort none</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
                <Body
                  key={item[rowKey] || index}
                  item={item}
                  columns={columns}
                  onRowClick={onRowClick}
                  rowCss={rowCss}
                  actions={actions}
                  actionsPlacement={actionsPlacement}
                  columnOptions={columnOptions}
                />
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
              scrollIntoTop(tableBoxElementId);
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
        DialogStore.show({
          content: <JSONHighlight className="w-full lg:w-[900px]" jsonStr={JSON.stringify(v, null, 2)} />,
        });
      }}
    >
      {JSON.stringify(v).slice(0, 50) + '...'}
    </p>
  );
}

function Actions<T>({ actions, actionsOptions, item, asCard }: { item: T; actions?: ActionsType<T>; actionsOptions?: ActionsOptions; asCard?: boolean }) {
  if (!actions) {
    return null;
  }

  const Com = actions(item);
  if (Array.isArray(Com)) {
    if (asCard) {
      return (
        <div className={cn('w-full flex items-center space-x-2', actionsOptions?.className)}>
          {Com.map((btn, index) => (
            <ActionButton key={index} props={btn.props} children={btn.children} />
          ))}
        </div>
      );
    }
    return (
      <TableCell className="max-w-[200px] overflow-auto space-x-2">
        {Com.map((btn, index) => (
          <ActionButton key={index} props={btn.props} children={btn.children} />
        ))}
      </TableCell>
    );
  }

  if (asCard) {
    return <div className={cn('w-full flex items-center space-x-2', actionsOptions?.className)}>{Com}</div>;
  }
  return <TableCell className="max-w-[200px] overflow-auto space-x-2">{Com}</TableCell>;
}

function Body<T>({
  item,
  columns,
  columnOptions,
  onRowClick,
  rowCss,
  actions,
  actionsPlacement,
}: {
  item: T;
  columns: Column<T>[];
  columnOptions?: ColumnOptions<T>;
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  actions?: ActionsType<T>;
  actionsPlacement?: 'left' | 'right';
}) {
  return (
    <TableRow
      className={cn('text-[0.8125rem] hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]', typeof rowCss === 'function' ? rowCss(item) : rowCss)}
      onClick={() => {
        onRowClick?.(item);
      }}
    >
      {actionsPlacement === 'left' && <Actions item={item} actions={actions} />}
      {columns.map((column) => {
        return (
          <TableCell key={column.key} className={cn('max-w-[200px] overflow-auto', columnOptions?.[column.key]?.tdClassName)}>
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

async function scrollIntoTop(tableBoxElementId?: string) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (tableBoxElementId) {
    const el = document.getElementById(tableBoxElementId);
    if (el) {
      const { top } = el.getBoundingClientRect();
      window.scrollTo({
        top: top + window.scrollY - 100,
        behavior: 'smooth',
      });
    }
  }
}

export default JSONTable;
export { JSONTable }

function CardOnMobile<T>({
  className,
  data,
  columns,
  columnOptions,
  rowKey,
  actions,
  actionsOptions,
  cardOptions,
  pagination,
  onRowClick,
  tableBoxElementId,
}: {
  className?: string;
  data: T[];
  columns: Column<T>[];
  columnOptions?: ColumnOptions<T>;
  rowKey?: string;
  actions?: ActionsType<T>;
  actionsOptions?: ActionsOptions;
  cardOptions?: CardOptions;
  pagination: PaginationState;
  onRowClick?: (item: T) => void;
  tableBoxElementId?: string;
}) {
  return (
    <div className={className} id={tableBoxElementId}>
      <div className={cn('space-y-2', cardOptions?.boxClassName)}>
        {data.map((item, index) => {
          return (
            <Card
              key={item[rowKey] || index}
              className={cn('w-full shadow-none p-4', cardOptions?.cardClassName)}
              isPressable={!!onRowClick}
              onPress={() => {
                onRowClick?.(item);
              }}
            >
              {columns.map((column, i) => {
                const option = columnOptions?.[column.key];
                return (
                  <div className="w-full" key={column.key}>
                    <div className={cn('w-full', cardOptions?.itemClassName)}>
                      <div className={cn('font-meidum text-[0.8125rem] text-[#64748B] dark:text-gray-300', option?.labelClassName)}>{column.label}</div>
                      <div className={cn('text-[0.8125rem]', option?.valueClassName)}>{column.render ? column.render(item) : renderFieldValue(item[column.key])}</div>
                    </div>
                    {cardOptions?.showDivider && i !== columns.length - 1 && <Divider className={cn('my-2', cardOptions?.dividerClassName)} />}
                  </div>
                );
              })}
              <Actions asCard item={item} actions={actions} actionsOptions={actionsOptions} />
            </Card>
          );
        })}
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
              scrollIntoTop(tableBoxElementId);
            }}
          />
        </div>
      )}
    </div>
  );
}
