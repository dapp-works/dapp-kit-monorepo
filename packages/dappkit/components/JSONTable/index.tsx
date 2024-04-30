"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination as NextuiPagination,
  PaginationProps,
  SlotsToClasses,
  Spinner,
  SpinnerProps,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableSlots,
} from '@nextui-org/react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { PaginationState } from "../../store/standard/PaginationState";
import { SkeletonBox } from "../Common/SkeletonBox";
import { _ } from "../../lib/lodash";
import { cn } from "../../lib/utils";

export type HeaderKeys<T extends Record<string, any>> = Array<keyof T | '$actions'>;

export type ColumnOptions<T extends Record<string, any>> = {
  [key in keyof T]?: {
    label?: React.ReactNode;
    hidden?: boolean;
    sortable?: boolean;
    sortKey?: string;
    order?: number;
    render?: (item: T) => any;
    labelClassName?: string;
    valueClassName?: string;
  };
} & {
  $actions?: {
    label?: React.ReactNode;
    hidden?: boolean;
    sortable?: boolean;
    sortKey?: string;
    order?: number;
    render?: (item: T) => any;
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

export type CardOptions = {
  boxClassName?: string;
  cardClassName?: string;
  itemClassName?: string;
  showDivider?: boolean;
  dividerClassName?: string;
};

type LoadingOptions = {
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
  classNames?: SlotsToClasses<TableSlots>;
  rowKey?: keyof T;
  dataSource: T[];
  headerKeys?: HeaderKeys<T>;
  columnOptions?: ColumnOptions<T>;
  isServerPaging?: boolean;
  pagination?: PaginationState;
  nextuiPaginationProps?: PaginationProps | {};
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  asCard?: boolean;
  cardOptions?: CardOptions;
  autoScrollToTop?: boolean;
  emptyContent?: React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  loadingContent?: React.ReactNode;
  isHeaderSticky?: boolean;
  extendedTableOptions?: {
    key: keyof T;
    columnOptions: ColumnOptions<any>;
  }[];
}

export const JSONTable = observer(<T extends Record<string, any>>(props: JSONTableProps<T>) => {
  const {
    className,
    classNames = {},
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
    asCard = false,
    cardOptions = {
      boxClassName: '',
      cardClassName: '',
      itemClassName: '',
      showDivider: true,
      dividerClassName: '',
    },
    autoScrollToTop = false,
    emptyContent = 'No Data',
    isLoading = false,
    loadingOptions,
    loadingContent,
    isHeaderSticky = false,
  } = props;

  const tableBoxRef = useRef<HTMLElement>(null);

  const { columns, sortableColumnsDefaultValue } = useMemo(() => {
    const firstData = dataSource[0];

    const allKeys = firstData ? Object.keys(firstData) : [];
    const keys = headerKeys ? headerKeys : columnOptions ? allKeys.filter((key) => !columnOptions[key]?.hidden) : allKeys;
    if (!keys.includes('$actions') && columnOptions['$actions']) {
      keys.push('$actions');
    }

    const sortableColumnsDefaultValue: { [k: string]: 'asc' | 'desc' | 'none' } = {};

    const columns: Column<T>[] = keys.map((key: string) => {
      const sortable = columnOptions?.[key]?.sortable;
      if (sortable) {
        sortableColumnsDefaultValue[key] = 'none';
      }
      return {
        key,
        label: columnOptions?.[key]?.label || (key === '$actions' ? '' : key),
        render: columnOptions?.[key]?.render,
      };
    });

    if (!headerKeys && columnOptions) {
      columns.sort((a, b) => {
        const aOrder = columnOptions[a.key]?.order || 0;
        const bOrder = columnOptions[b.key]?.order || 0;
        return bOrder - aOrder;
      });
    }

    const extendedTables = firstData
      ? extendedTableOptions
        .filter((item) => {
          return Array.isArray(firstData[item.key]);
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
        })
      : [];

    return {
      columns,
      extendedTables,
      sortableColumnsDefaultValue,
    };
  }, [dataSource, columnOptions]);

  const [sortableColumnsMap, setSortableColumnsMap] = useState<{ [k: string]: 'asc' | 'desc' | 'none' }>({});
  const [sortedData, setSortedData] = useState<T[]>(dataSource);

  useEffect(() => {
    setSortableColumnsMap(sortableColumnsDefaultValue);
  }, [sortableColumnsDefaultValue]);

  useEffect(() => {
    setSortedData(dataSource);
    if (!isServerPaging) {
      pagination.setData({
        total: dataSource.length,
      });
    }
  }, [dataSource]);

  const data = isServerPaging ? sortedData : sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  if (asCard) {
    return (
      <CardUI
        className={className}
        rowKey={rowKey}
        data={data}
        columns={columns}
        columnOptions={columnOptions}
        cardOptions={cardOptions}
        pagination={pagination}
        nextuiPaginationProps={nextuiPaginationProps}
        onRowClick={onRowClick}
        autoScrollToTop={autoScrollToTop}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingOptions={loadingOptions}
        loadingContent={loadingContent}
      />
    );
  }

  return (
    <>
      <Table
        removeWrapper
        isHeaderSticky={isHeaderSticky}
        className={cn('relative w-full overflow-auto h-[400px]', className)}
        classNames={classNames}
        ref={tableBoxRef}
      >
        <TableHeader columns={columns}>
          {columns.map((item) => (
            <TableColumn key={item.key}>
              <div className="flex items-center">
                <span>{item.label}</span>
                {!!sortableColumnsMap[item.key] && (
                  <Dropdown
                    showArrow
                    backdrop="opaque"
                    placement="bottom"
                    classNames={{
                      content: 'min-w-[100px] rounded-lg shadow-md border dark:border-[#3e3e3e]',
                    }}
                  >
                    <DropdownTrigger>
                      <button className="outline-none p-0">
                        {sortableColumnsMap[item.key] === 'desc' && <ChevronDown size={14} />}
                        {sortableColumnsMap[item.key] === 'asc' && <ChevronUp size={14} />}
                        {sortableColumnsMap[item.key] === 'none' && <ChevronsUpDown size={14} />}
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu variant="flat" selectionMode="single" selectedKeys={[sortableColumnsMap[item.key]]}>
                      <DropdownItem
                        key="asc"
                        onClick={() => {
                          const { sortableColumns, sortedData } = sortData({
                            type: 'asc',
                            key: item.key,
                            sortKey: columnOptions?.[item.key]?.sortKey,
                            sortableColumnsMap,
                            dataSource,
                          });
                          setSortableColumnsMap(sortableColumns);
                          setSortedData(sortedData);
                        }}
                      >
                        <span className="text-xs font-bold">Sort ascending</span>
                      </DropdownItem>
                      <DropdownItem
                        key="desc"
                        onClick={() => {
                          const { sortableColumns, sortedData } = sortData({
                            type: 'desc',
                            key: item.key,
                            sortKey: columnOptions?.[item.key]?.sortKey,
                            sortableColumnsMap,
                            dataSource,
                          });
                          setSortableColumnsMap(sortableColumns);
                          setSortedData(sortedData);
                        }}
                      >
                        <span className="text-xs font-bold">Sort descending</span>
                      </DropdownItem>
                      <DropdownItem
                        key="none"
                        onClick={() => {
                          const { sortableColumns, sortedData } = sortData({
                            type: 'none',
                            key: item.key,
                            sortKey: columnOptions?.[item.key]?.sortKey,
                            sortableColumnsMap,
                            dataSource,
                          });
                          setSortableColumnsMap(sortableColumns);
                          setSortedData(sortedData);
                        }}
                      >
                        <span className="text-xs font-bold">Sort none</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </TableColumn>
          ))}
        </TableHeader>
        {isLoading ? (
          <TableBody emptyContent={loadingContent || DefaultLoading({ loadingOptions })}>{[]}</TableBody>
        ) : data.length > 0 ? (
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow
                  key={item[rowKey] || index}
                  className={cn('', typeof rowCss === 'function' ? rowCss(item) : rowCss)}
                  onClick={() => {
                    onRowClick?.(item);
                  }}
                >
                  {columns.map((column) => {
                    return <TableCell key={column.key}>{column.render ? column.render(item) : renderFieldValue(item[column.key])}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        ) : (
          <TableBody emptyContent={emptyContent}>{[]}</TableBody>
        )}
      </Table>
      {pagination.total > pagination.limit && (
        <div className="flex justify-center">
          <NextuiPagination
            className="mt-2"
            showControls
            showShadow
            size="sm"
            radius="sm"
            color="primary"
            initialPage={1}
            total={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            onChange={(currentPage) => {
              pagination.setData({
                page: currentPage,
              });
              if (autoScrollToTop && tableBoxRef.current) {
                scrollIntoTop(tableBoxRef.current);
              }
            }}
            {...nextuiPaginationProps}
          />
        </div>
      )}
    </>
  );
});

function renderFieldValue(v: any) {
  if (typeof v == 'string' || typeof v == 'number') {
    return v;
  }
  if (v == null) {
    return null;
  }
  return JSON.stringify(v);
}

function sortData<T>({
  sortKey,
  key,
  type,
  sortableColumnsMap,
  dataSource,
}: {
  sortKey: string;
  key: string;
  type: 'asc' | 'desc' | 'none';
  sortableColumnsMap: {
    [k: string]: 'asc' | 'desc' | 'none';
  };
  dataSource: T[];
}) {
  const sortableColumns: { [k: string]: 'asc' | 'desc' | 'none' } = {};
  Object.keys(sortableColumnsMap).map((k) => {
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
  return {
    sortableColumns,
    sortedData,
  };
}

function CardUI<T>({
  className,
  data,
  columns,
  columnOptions,
  rowKey,
  cardOptions,
  pagination,
  nextuiPaginationProps,
  onRowClick,
  autoScrollToTop,
  emptyContent,
  isLoading,
  loadingOptions,
  loadingContent,
}: {
  className?: string;
  data: T[];
  columns: Column<T>[];
  columnOptions?: ColumnOptions<T>;
  rowKey: string | number | symbol;
  cardOptions?: CardOptions;
  pagination: PaginationState;
  nextuiPaginationProps: PaginationProps | {};
  onRowClick?: (item: T) => void;
  autoScrollToTop?: boolean;
  emptyContent?: React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  loadingContent?: React.ReactNode;
}) {
  const cardBoxRef = useRef<HTMLDivElement>(null);
  return (
    <div className={className} ref={cardBoxRef}>
      <div className={cn('space-y-2', cardOptions?.boxClassName)}>
        {isLoading ? (
          loadingContent ? (
            <Card className={cn('w-full h-40 flex flex-col justify-center items-center p-4 shadow-sm text-foreground-400', cardOptions?.cardClassName)}>{loadingContent}</Card>
          ) : (
            <DefaultLoading loadingOptions={loadingOptions} />
          )
        ) : data.length > 0 ? (
          data.map((item, index) => {
            return (
              <Card
                key={item[rowKey] || index}
                className={cn('w-full shadow-sm p-4', cardOptions?.cardClassName)}
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
                        <div className={cn('font-meidum text-xs text-foreground-400', option?.labelClassName)}>{column.label}</div>
                        <div className={cn('text-xs', option?.valueClassName)}>{column.render ? column.render(item) : renderFieldValue(item[column.key])}</div>
                      </div>
                      {cardOptions?.showDivider && i !== columns.length - 1 && <Divider className={cn('my-2', cardOptions?.dividerClassName)} />}
                    </div>
                  );
                })}
              </Card>
            );
          })
        ) : (
          <Card className={cn('w-full h-40 flex flex-col justify-center items-center p-4 shadow-sm text-foreground-400', cardOptions?.cardClassName)}>{emptyContent}</Card>
        )}
      </div>
      {pagination.total > pagination.limit && (
        <div className="flex justify-center">
          <NextuiPagination
            className='mt-2'
            showControls
            showShadow
            size="sm"
            radius="sm"
            color="primary"
            initialPage={1}
            total={Math.ceil(pagination.total / pagination.limit)}
            page={pagination.page}
            onChange={(currentPage) => {
              pagination.setData({
                page: currentPage,
              });
              if (autoScrollToTop && cardBoxRef.current) {
                scrollIntoTop(cardBoxRef.current);
              }
            }}
            {...nextuiPaginationProps}
          />
        </div>
      )}
    </div>
  );
}

function DefaultLoading({ loadingOptions }: { loadingOptions?: LoadingOptions }) {
  const type = loadingOptions?.type || 'skeleton';
  const skeletonOptions = loadingOptions?.skeleton;
  const spinnerOptions = loadingOptions?.spinner;
  const spinnerProps = spinnerOptions?.spinnerProps || {};

  if (type === 'skeleton') {
    return <SkeletonBox className={cn('mt-2 flex-col', skeletonOptions?.boxClassName)} skClassName={cn('h-[30px] rounded', skeletonOptions?.skeletonClassName)} line={skeletonOptions?.line || 5} />;
  }

  return (
    <div className={cn('w-full h-[100px] flex justify-center items-center', spinnerOptions?.boxClassName)}>
      <Spinner size="sm" color="primary" {...spinnerProps} />
      <div className={cn('ml-2 text-[#64748B] text-sm', spinnerOptions?.textClassName)}>{spinnerOptions?.text || 'Loading...'}</div>
    </div>
  );
}

function scrollIntoTop(target: HTMLElement) {
  if (target) {
    const { top } = target.getBoundingClientRect();
    window.scrollTo({
      top: top + window.scrollY - 100,
      behavior: 'smooth',
    });
  }
}

function CollapseBody<T>({
  data,
  rowKey,
  columns,
  extendedTables,
  rowCss,
}: {
  data: T[];
  rowKey: string | number | symbol;
  columns: Column<T>[];
  extendedTables: ExtendedTable<any>[];
  rowCss?: string | ((item: T) => string | undefined);
}) {
  return (
    <TableBody>
      {data.map((item, index) => {
        return <CollapseBodyRow key={item[rowKey] || index} item={item} columns={columns} extendedTables={extendedTables} rowCss={rowCss} />;
      })}
    </TableBody>
  );
}

function CollapseBodyRow<T>({ item, columns, extendedTables, rowCss }: { item: T; columns: Column<T>[]; extendedTables: ExtendedTable<any>[]; rowCss?: string | ((item: T) => string | undefined) }) {
  const [isOpen, setIsOpen] = useState(false);
  const rows = [
    <TableRow
      className={cn('text-xs cursor-pointer hover:bg-[#f6f6f9] dark:hover:bg-[#19191c]', typeof rowCss === 'function' ? rowCss(item) : rowCss)}
      onClick={(e: any) => {
        const { nodeName } = e.target;
        if (nodeName === 'TD' || nodeName === 'svg') {
          setIsOpen((v) => !v);
        }
      }}
    >
      {columns.map((column) => {
        return (
          <TableCell key={column.key} className="max-w-[200px] overflow-auto">
            {column.render ? column.render(item) : renderFieldValue(item[column.key])}
          </TableCell>
        );
      })}
    </TableRow>,
    <TableRow className={cn(isOpen ? 'table-row' : 'hidden')}>
      <TableCell colSpan={columns.length}>
        {extendedTables.map((ex) => {
          const exColumns = ex.columns;
          const exRow = item[ex.key];
          return (
            <Table className="mt-[10px]" key={ex.key}>
              <TableHeader>
                {exColumns.map((exC) => {
                  return (
                    <TableColumn key={exC.key} className="text-xs text-[#64748B] dark:text-gray-300">
                      {exC.label}
                    </TableColumn>
                  );
                })}
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
    </TableRow>,
  ];
  return rows.map((row) => row);
}
