"use client";

import React, { useEffect, useRef, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button, ButtonProps, Card, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination as NextuiPagination, PaginationProps, Spinner, SpinnerProps } from '@nextui-org/react';
import { ChevronDown, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";
import JSONHighlight from "../Common/JSONHighlight";
import { SkeletonBox } from "../Common/SkeletonBox";
import { _ } from "../../lib/lodash";
import { cn } from "../../lib/utils";
import { DialogStore } from "../../module/Dialog";
import { PaginationState } from "../../store/standard/PaginationState";
import { v4 as uuid } from "uuid";

export type ActionButtonType = {
  props?: ButtonProps;
  children: React.ReactNode;
};

export type ActionsOptions = {
  headLabel?: string;
  placement?: 'left' | 'right';
  className?: string;
};

export type HeaderKeys<T extends Record<string, any>> = Array<keyof T>;

export type ColumnOptions<T extends Record<string, any>> = {
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

export type Column<T extends Record<string, any>> = {
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

type LoadingOptions = {
  className?: string;
  type?: 'skeleton' | 'spinner';
  skeleton?: {
    boxClassName?: string;
    skeletonClassName?: string;
    line?: number;
  };
  spinner?: {
    boxClassName?: string;
    spinnerProps?: SpinnerProps;
    text?: string;
    textClassName?: string;
  };
};

export interface JSONTableProps<T extends Record<string, any>> {
  className?: string;
  dataSource: T[];
  columnOptions?: ColumnOptions<T>;
  headerKeys?: HeaderKeys<T>;
  isServerPaging?: boolean;
  extendedTableOptions?: {
    key: keyof T;
    columnOptions: ColumnOptions<any>;
  }[];
  rowKey?: string;
  pagination?: PaginationState;
  nextuiPaginationProps?: PaginationProps | {};
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  actions?: ActionsType<T>;
  actionsOptions?: ActionsOptions;
  asCard?: boolean;
  cardOptions?: CardOptions;
  autoScrollToTop?: boolean;
  NoData?: ({ className, columns }: { className?: string; columns: Column<T>[] }) => React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  Loading?: ({ className, columns }: { className?: string; columns: Column<T>[] }) => React.ReactNode;
}

export const JSONTable = observer(<T extends Record<string, any>>(props: JSONTableProps<T>) => {
  const {
    className,
    dataSource,
    columnOptions,
    headerKeys,
    isServerPaging,
    pagination = new PaginationState({
      page: 1,
      limit: 8,
    }),
    nextuiPaginationProps = {},
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
    NoData = DefaultNoData,
    isLoading = false,
    loadingOptions,
    Loading = DefaultLoading,
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

  const tableBoxElementId = useRef(autoScrollToTop ? `table-box-${uuid().slice(0, 8)}` : undefined).current;

  useEffect(() => {
    const firstData = dataSource[0];

    const allKeys = firstData ? Object.keys(firstData) : [];
    const keys = headerKeys ? headerKeys : columnOptions ? allKeys.filter((key) => !columnOptions[key]?.hidden) : allKeys;

    const sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' } = {};

    const columns: Column<T>[] = keys
      .map((key: string) => {
        const sortable = columnOptions?.[key]?.sortable;
        if (sortable) {
          sortableColumns[key] = 'none';
        }
        return {
          key,
          label: columnOptions?.[key]?.label || key,
          render: columnOptions?.[key]?.render,
        };
      })

    if (!headerKeys && columnOptions) {
      columns.sort((a, b) => {
        const aOrder = columnOptions[a.key]?.order || 0;
        const bOrder = columnOptions[b.key]?.order || 0;
        return bOrder - aOrder;
      });
    }

    const extendedTables = firstData ? extendedTableOptions
      .filter((item) => {
        return Array.isArray(firstData[item.key])
      })
      .map((item) => {
        const index = columns.findIndex((c) => c.key === item.key);
        if (index > -1) {
          columns.splice(index, 1);
        }

        const keys = Object.keys(item.columnOptions);
        return {
          key: item.key as string,
          columns: keys.map((k) => {
            const option = item.columnOptions[k];
            return {
              key: k,
              label: option?.label || k,
              render: option?.render,
            };
          }),
        };
      }) : [];

    store.setData({
      sortableColumns,
      columns,
      extendedTables,
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

  const { columns, extendedTables, sortedData } = store;
  const needExtendedTable = !!extendedTables.length;
  const data = isServerPaging ? sortedData : sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  if (isLoading) {
    return <Loading className={className} columns={columns} loadingOptions={loadingOptions} />;
  }

  if (data.length === 0) {
    return <NoData className={className} columns={columns} />;
  }

  if (asCard) {
    return (
      <CardUI
        className={className}
        rowKey={rowKey}
        data={data}
        columns={columns}
        columnOptions={columnOptions}
        actions={actions}
        actionsOptions={actionsOptions}
        cardOptions={cardOptions}
        pagination={pagination}
        nextuiPaginationProps={nextuiPaginationProps}
        onRowClick={onRowClick}
        tableBoxElementId={tableBoxElementId}
      />
    );
  }

  return (
    <>
      <div className={cn('relative w-full overflow-auto h-[400px]', className)} id={tableBoxElementId}>
        <Table>
          <TableHeader className="sticky top-0">
            <TableRow className="bg-[#F4F4F5] dark:bg-[#3F3F45] shadow-sm">
              {needExtendedTable && <TableHead></TableHead>}
              {actionsPlacement === 'left' && <TableHead className="font-meidum text-xs text-[#64748B] dark:text-gray-300">{actionsHeadLabel}</TableHead>}
              {columns.map((item, index) => (
                <TableHead className={cn('font-meidum text-xs text-[#64748B] dark:text-gray-300', columnOptions?.[item.key]?.thClassName)} key={item.key}>
                  <div className="flex items-center">
                    <span>{item.label}</span>
                    {!!store.sortableColumns[item.key] && (
                      <Dropdown
                        showArrow
                        backdrop="opaque"
                        placement="bottom"
                      >
                        <DropdownTrigger>
                          <button className="outline-none p-0">
                            {store.sortableColumns[item.key] === 'desc' && <ChevronDown size={14} />}
                            {store.sortableColumns[item.key] === 'asc' && <ChevronUp size={14} />}
                            {store.sortableColumns[item.key] === 'none' && <ChevronsUpDown size={14} />}
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat" selectionMode="single" selectedKeys={[store.sortableColumns[item.key]]}>
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
              {actionsPlacement === 'right' && <TableHead className="font-meidum text-xs text-[#64748B] dark:text-gray-300">{actionsHeadLabel}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) =>
              needExtendedTable ? (
                <CollapseBody key={item[rowKey] || index} item={item} columns={columns} extendedTables={extendedTables} rowCss={rowCss} actions={actions} actionsPlacement={actionsPlacement} />
              ) : (
                <Body
                  key={item[rowKey] || index}
                  item={item}
                  columns={columns}
                  columnOptions={columnOptions}
                  onRowClick={onRowClick}
                  rowCss={rowCss}
                  actions={actions}
                  actionsPlacement={actionsPlacement}
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
            initialPage={1}
            total={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            onChange={(currentPage) => {
              pagination.setData({
                page: currentPage,
              });
              scrollIntoTop(tableBoxElementId);
            }}
            {...nextuiPaginationProps}
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
      className={cn('text-xs hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]', typeof rowCss === 'function' ? rowCss(item) : rowCss)}
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

function CollapseBody<T>({ item,
  columns,
  extendedTables,
  rowCss,
  actions,
  actionsPlacement }: {
    item: T;
    columns: Column<T>[];
    extendedTables: ExtendedTable<any>[];
    rowCss?: string | ((item: T) => string | undefined);
    actions?: ActionsType<T>;
    actionsPlacement?: 'left' | 'right';
  }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TableRow
        className={cn('text-xs cursor-pointer hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]', typeof rowCss === 'function' ? rowCss(item) : rowCss)}
        onClick={(e: any) => {
          const { nodeName } = e.target;
          if (nodeName === 'TD' || nodeName === 'svg') {
            setIsOpen((v) => !v);
          }
        }}
      >
        <TableCell className="w-10">{isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</TableCell>
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
                        <TableHead key={exC.key} className="text-xs text-[#64748B] dark:text-gray-300">
                          {exC.label}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exRow.map((exItem) => (
                    <TableRow className="text-xs hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]" key={exItem.key}>
                      {exColumns.map((exC) => {
                        return (
                          <TableCell key={exC.key} className="max-w-[200px] overflow-auto">
                            {exC.render
                              ? exC.render({
                                ...exItem,
                                $parent: item,
                              })
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

function CardUI<T>({
  className,
  data,
  columns,
  columnOptions,
  rowKey,
  actions,
  actionsOptions,
  cardOptions,
  pagination,
  nextuiPaginationProps,
  onRowClick,
  tableBoxElementId,
}: {
  className?: string;
  data: T[];
  columns: Column<T>[];
  columnOptions?: ColumnOptions<T>;
  rowKey: string;
  actions?: ActionsType<T>;
  actionsOptions?: ActionsOptions;
  cardOptions?: CardOptions;
  pagination: PaginationState;
  nextuiPaginationProps: PaginationProps | {};
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
                      <div className={cn('font-meidum text-xs text-[#64748B] dark:text-gray-300', option?.labelClassName)}>{column.label}</div>
                      <div className={cn('text-xs', option?.valueClassName)}>{column.render ? column.render(item) : renderFieldValue(item[column.key])}</div>
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
            initialPage={1}
            total={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            onChange={(currentPage) => {
              pagination.setData({
                page: currentPage,
              });
              scrollIntoTop(tableBoxElementId);
            }}
            {...nextuiPaginationProps}
          />
        </div>
      )}
    </div>
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

export function TableHeaderOfNoData<T>({ className, columns }: { className?: string; columns: Column<T>[] }) {
  return (
    <div className={cn('flex items-center justify-between bg-[#F4F4F5] dark:bg-[#3F3F45] shadow-sm overflow-auto rounded-l-lg rounded-r-lg', className)}>
      {columns.map((item) => (
        <div key={item.key} className="p-2 text-left font-medium text-xs text-[#64748B] dark:text-gray-300 whitespace-nowrap">
          {item.label}
        </div>
      ))}
    </div>
  );
}

function DefaultNoData<T>({ className, columns }: { className?: string; columns: Column<T>[] }) {
  return (
    <Card className={cn('w-full shadow-sm border dark:border-[#3e3e3e] rounded-lg', className)}>
      <TableHeaderOfNoData columns={columns} />
      <div className="w-full h-[100px] flex flex-col justify-center items-center">
        <div className="text-[#64748B] text-sm">No Data</div>
      </div>
    </Card>
  );
}

export function TableHeaderOfLoading<T>({ className, columns }: { className?: string; columns: Column<T>[] }) {
  return <TableHeaderOfNoData columns={columns} className={className} />;
}

function DefaultLoading<T>({ className, columns, loadingOptions }: { className?: string; columns: Column<T>[]; loadingOptions?: LoadingOptions }) {
  const type = loadingOptions?.type || 'skeleton';
  const skeletonOptions = loadingOptions?.skeleton;
  const spinnerOptions = loadingOptions?.spinner;
  const spinnerProps = spinnerOptions?.spinnerProps || {};
  return (
    <div className={cn('w-full shadow-sm', className)}>
      <TableHeaderOfLoading columns={columns} />
      {type === 'skeleton' ? (
        <SkeletonBox className={cn('mt-2 flex-col', skeletonOptions?.boxClassName)} skClassName={cn('h-[30px] rounded', skeletonOptions?.skeletonClassName)} line={skeletonOptions?.line || 5} />
      ) : (
        <div className={cn('w-full h-[100px] flex justify-center items-center', spinnerOptions?.boxClassName)}>
          <Spinner size="sm" color="primary" {...spinnerProps} />
          <div className={cn('ml-2 text-[#64748B] text-sm', spinnerOptions?.textClassName)}>{spinnerOptions?.text || 'Loading...'}</div>
        </div>
      )}
    </div>
  );
}
