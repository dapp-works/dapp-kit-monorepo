import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Card,
  Divider,
  Pagination as NextuiPagination,
  PaginationProps,
  Spinner,
  SpinnerProps,
} from '@nextui-org/react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { PaginationState } from "../../store/standard/PaginationState";
import { SkeletonBox } from "../Common/SkeletonBox";
import { _ } from "../../lib/lodash";
import { cn } from "../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { VList } from 'virtua';

export type TableClassNames = {
  table?: string;
  thead?: string;
  tr?: string;
  th?: string;
  tbody?: string;
  td?: string;
}

export type HeaderKeys<T extends Record<string, any>> = Array<keyof T | '$actions'>;

export type ColumnConfig<T> = {
  label?: React.ReactNode;
  width?: number;
  hidden?: boolean;
  sortable?: boolean;
  sortKey?: string;
  order?: number;
  render?: (item: T) => any;
}

export type ColumnOptions<T> = {
  [key in keyof T]?: ColumnConfig<T>;
} & {
  $actions?: ColumnConfig<T>;
};

type Column<T> = {
  key: string;
  label: React.ReactNode;
  width: number;
  render?: (item: T) => any;
};

type CollapsedTable<U> = {
  key: string;
  columns: Column<U>[];
};

export type CardOptions = {
  cardClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  showDivider?: boolean;
  dividerClassName?: string;
  colSpan?: number
  cardGroupClassName?: string;
};

export type LoadingOptions = {
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

export type SortingUIOptions = {
  showDropdown?: boolean;
  dropdownTriggerBtnClassName?: string;
  dropdownContentClassName?: string;
  dropdownItemClassName?: string;
  titles?: {
    asc?: string;
    desc?: string;
    none?: string;
  };
};

export type CollapsedTableConfig<T> = {
  classNames?: TableClassNames;
  options: {
    key: keyof T;
    headerKeys: string[];
    columnOptions: ColumnOptions<any>;
  }[];
  collapsedHandlerPosition?: 'left' | 'right';
  collapsedHandlerBoxCss?: string;
  openedIcon?: React.ReactNode;
  closedIcon?: React.ReactNode;
  onRowClick?: (item: any) => void;
  rowCss?: string | ((item: any) => string | undefined);
  emptyContent?: React.ReactNode;
}

export type VirtualizedOptions = {
  isVirtualized?: boolean;
  vListHeight?: number;
  classNames?: {
    header?: string;
    headerCell?: string;
    row?: string;
    rowCell?: string;
  },
  fetchData?: () => Promise<void>;
}

export interface JSONTableProps<T extends Record<string, any>> {
  className?: string;
  classNames?: TableClassNames;
  rowKey?: string;
  dataSource: T[];
  headerKeys?: HeaderKeys<T>;
  columnOptions?: ColumnOptions<T>;
  isServerPaging?: boolean;
  pagination?: PaginationState;
  nextuiPaginationProps?: Partial<PaginationProps>;
  showPagination?: boolean;
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  asCard?: boolean;
  cardOptions?: CardOptions;
  autoScrollToTop?: boolean;
  emptyContent?: React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  loadingContent?: React.ReactNode;
  columnSlot?: React.ReactNode;
  isHeaderSticky?: boolean;
  sortingUIOptions?: SortingUIOptions;
  collapsedTableConfig?: CollapsedTableConfig<T>;
  virtualizedOptions?: VirtualizedOptions;
}

export const JSONTable = (<T extends Record<string, any>>(props: JSONTableProps<T>) => {
  const {
    className,
    classNames,
    dataSource = [],
    columnOptions,
    headerKeys,
    isServerPaging,
    pagination,
    nextuiPaginationProps,
    showPagination = true,
    rowKey,
    onRowClick,
    rowCss,
    columnSlot,
    asCard = false,
    cardOptions,
    autoScrollToTop = false,
    emptyContent,
    isLoading = false,
    loadingOptions,
    loadingContent,
    isHeaderSticky = false,
    sortingUIOptions,
    collapsedTableConfig,
    virtualizedOptions
  } = props;
  const [sortableColumnsMap, setSortableColumnsMap] = useState<{ [k: string]: 'asc' | 'desc' | 'none' }>({});
  const [sortedData, setSortedData] = useState<T[]>(dataSource);

  const { columns, sortableColumnsDefaultValue, showCollapsedTables, collapsedTables } = useMemo(() => {
    const firstData = dataSource[0];

    const allKeys = firstData ? Object.keys(firstData) : [];
    const keys = headerKeys ? headerKeys : columnOptions ? allKeys.filter((key) => !columnOptions[key]?.hidden) : allKeys;
    if (!keys.includes('$actions') && columnOptions && columnOptions['$actions']) {
      keys.push('$actions');
    }

    const sortableColumnsDefaultValue: { [k: string]: 'asc' | 'desc' | 'none' } = {};

    let columns: Column<T>[] = keys.map((key: string) => {
      const sortable = columnOptions?.[key]?.sortable;
      if (sortable) {
        sortableColumnsDefaultValue[key] = 'none';
      }
      return {
        key,
        label: columnOptions?.[key]?.label ?? (key === '$actions' ? '' : key),
        width: columnOptions?.[key]?.width ?? 60,
        render: columnOptions?.[key]?.render,
      };
    });

    if (!headerKeys && columnOptions) {
      columns.sort((a, b) => {
        const aOrder = columnOptions[a.key]?.order ?? 0;
        const bOrder = columnOptions[b.key]?.order ?? 0;
        return bOrder - aOrder;
      });
    }

    let collapsedTables: CollapsedTable<any>[] = [];
    if (firstData && collapsedTableConfig?.options) {
      const collapsedTableOptions = collapsedTableConfig.options;
      collapsedTables = collapsedTableOptions
        .filter((item) => {
          return Array.isArray(firstData[item.key]);
        })
        .map((item) => {
          const index = columns.findIndex((c) => c.key === item.key);
          if (index > -1) {
            columns.splice(index, 1);
          }
          const keys = item.headerKeys || [];
          if (!keys.includes('$actions') && item.columnOptions && item.columnOptions['$actions']) {
            keys.push('$actions');
          }
          return {
            key: item.key as string,
            columns: keys.map((k) => {
              const option = item.columnOptions[k];
              return {
                key: k,
                label: option?.label ?? k,
                width: option?.width ?? 60,
                render: option?.render,
              };
            }),
          };
        })
    }

    const showCollapsedTables = collapsedTables.length > 0;
    if (showCollapsedTables && !virtualizedOptions?.isVirtualized) {
      const collapsedHandlerPosition = collapsedTableConfig?.collapsedHandlerPosition || 'right';
      if (collapsedHandlerPosition === 'right') {
        columns.push({
          key: '$collapsedHandler',
          label: '',
          width: 60,
        })
      } else {
        columns = [
          {
            key: '$collapsedHandler',
            label: '',
            width: 60,
          },
          ...columns
        ];
      }
    }

    return {
      columns,
      sortableColumnsDefaultValue,
      showCollapsedTables,
      collapsedTables,
    };
  }, [dataSource, columnOptions]);

  useEffect(() => {
    setSortableColumnsMap(sortableColumnsDefaultValue);
  }, [sortableColumnsDefaultValue]);

  useEffect(() => {
    setSortedData(dataSource);
  }, [dataSource]);

  if (asCard) {
    return (
      <CardUI
        className={className}
        rowKey={rowKey}
        sortedData={sortedData}
        columns={columns}
        cardOptions={cardOptions}
        onRowClick={onRowClick}
        autoScrollToTop={autoScrollToTop}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingOptions={loadingOptions}
        loadingContent={loadingContent}
        virtualizedOptions={virtualizedOptions}
        columnSlot={columnSlot}
      />
    );
  }

  if (virtualizedOptions?.isVirtualized) {
    return (
      <VirtualizedListUI
        className={className}
        rowKey={rowKey}
        sortedData={sortedData}
        dataSource={dataSource}
        columns={columns}
        columnOptions={columnOptions}
        sortableColumnsMap={sortableColumnsMap}
        sortingUIOptions={sortingUIOptions}
        setSortableColumnsMap={setSortableColumnsMap}
        setSortedData={setSortedData}
        onRowClick={onRowClick}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingOptions={loadingOptions}
        loadingContent={loadingContent}
        virtualizedOptions={virtualizedOptions}
      />
    )
  }

  return (
    <TableUI
      className={className}
      classNames={classNames}
      isHeaderSticky={isHeaderSticky}
      sortedData={sortedData}
      dataSource={dataSource}
      columns={columns}
      columnOptions={columnOptions}
      sortableColumnsMap={sortableColumnsMap}
      sortingUIOptions={sortingUIOptions}
      setSortableColumnsMap={setSortableColumnsMap}
      setSortedData={setSortedData}
      isLoading={isLoading}
      loadingContent={loadingContent}
      loadingOptions={loadingOptions}
      emptyContent={emptyContent}
      rowCss={rowCss}
      onRowClick={onRowClick}
      showCollapsedTables={showCollapsedTables}
      collapsedTableConfig={collapsedTableConfig}
      collapsedTables={collapsedTables}
      rowKey={rowKey}
      isServerPaging={isServerPaging}
      showPagination={showPagination}
      pagination={pagination}
      nextuiPaginationProps={nextuiPaginationProps}
      autoScrollToTop={autoScrollToTop}
      columnSlot={columnSlot}
    />
  )
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
  sortKey: string | undefined;
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

function SortingComponent<T>({
  sortingUIOptions,
  columnOptions,
  sortableColumnsMap,
  item,
  onSort,
}: {
  sortingUIOptions: SortingUIOptions;
  columnOptions?: ColumnOptions<T>;
  sortableColumnsMap: { [k: string]: 'asc' | 'desc' | 'none' };
  item: Column<T>;
  onSort: (e: { type: 'asc' | 'desc' | 'none'; key: string; sortKey: string }) => void;
}) {
  if (sortingUIOptions?.showDropdown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className={cn('outline-none p-1', sortingUIOptions?.dropdownTriggerBtnClassName)}>
            {sortableColumnsMap[item.key] === 'desc' && <ChevronDown size={14} />}
            {sortableColumnsMap[item.key] === 'asc' && <ChevronUp size={14} />}
            {sortableColumnsMap[item.key] === 'none' && <ChevronsUpDown size={14} />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn('p-2 space-y-1 min-w-[4rem]', sortingUIOptions?.dropdownContentClassName)} collisionPadding={10} sideOffset={5}>
          <DropdownMenuItem
            className={cn('text-xs font-bold cursor-pointer', sortingUIOptions?.dropdownItemClassName)}
            onClick={() => {
              onSort({
                type: 'asc',
                key: item.key,
                sortKey: columnOptions?.[item.key]?.sortKey,
              });
            }}
          >
            {sortingUIOptions?.titles?.asc || 'ASC'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn('text-xs font-bold cursor-pointer', sortingUIOptions?.dropdownItemClassName)}
            onClick={() => {
              onSort({
                type: 'desc',
                key: item.key,
                sortKey: columnOptions?.[item.key]?.sortKey,
              });
            }}
          >
            {sortingUIOptions?.titles?.desc || 'DESC'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn('text-xs font-bold cursor-pointer', sortingUIOptions?.dropdownItemClassName)}
            onClick={() => {
              onSort({
                type: 'none',
                key: item.key,
                sortKey: columnOptions?.[item.key]?.sortKey,
              });
            }}
          >
            {sortingUIOptions?.titles?.none || 'NONE'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <button className={cn('outline-none p-1', sortingUIOptions?.dropdownTriggerBtnClassName)}>
      {sortableColumnsMap[item.key] === 'none' && (
        <ChevronsUpDown
          size={14}
          onClick={() => {
            onSort({
              type: 'desc',
              key: item.key,
              sortKey: columnOptions?.[item.key]?.sortKey,
            });
          }}
        />
      )}
      {sortableColumnsMap[item.key] === 'desc' && (
        <ChevronDown
          size={14}
          onClick={() => {
            onSort({
              type: 'asc',
              key: item.key,
              sortKey: columnOptions?.[item.key]?.sortKey,
            });
          }}
        />
      )}
      {sortableColumnsMap[item.key] === 'asc' && (
        <ChevronUp
          size={14}
          onClick={() => {
            onSort({
              type: 'none',
              key: item.key,
              sortKey: columnOptions?.[item.key]?.sortKey,
            });
          }}
        />
      )}
    </button>
  );
}

function CardUI<T>({
  className,
  sortedData,
  columns,
  rowKey,
  cardOptions,
  onRowClick,
  emptyContent,
  isLoading,
  loadingOptions,
  loadingContent,
  virtualizedOptions,
  columnSlot,
}: {
  className?: string;
  sortedData: T[];
  columns: Column<T>[];
  rowKey?: string;
  cardOptions?: CardOptions;
  onRowClick?: (item: T) => void;
  autoScrollToTop?: boolean;
  emptyContent?: React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  loadingContent?: React.ReactNode;
  virtualizedOptions?: VirtualizedOptions;
  columnSlot?: React.ReactNode;
}) {
  const colSpan = cardOptions?.colSpan || 1;
  const fetchedCountRef = useRef(-1);
  const elements = useMemo(
    () => {
      const MyCard = ({ item }) => {
        return (
          <Card
            className={cn('mb-2 w-full shadow-sm p-4 rounded-lg', cardOptions?.cardClassName)}
            isPressable={!!onRowClick}
            onPress={() => {
              onRowClick?.(item);
            }}
          >
            {columns.map((column, i) => {
              return (
                <div className="w-full" key={column.key}>
                  <div className={cn('w-full', cardOptions?.itemClassName)}>
                    <div className={cn('font-meidum text-xs text-foreground-400', cardOptions?.labelClassName)}>{column.label}</div>
                    <div className={cn('text-xs', cardOptions?.valueClassName)}>{column.render ? column.render(item) : renderFieldValue(item[column.key])}</div>
                  </div>
                  {cardOptions?.showDivider && i !== columns.length - 1 && <Divider className={cn('my-2', cardOptions?.dividerClassName)} />}
                </div>
              );
            })}
            {columnSlot}
          </Card>
        );
      }
      if (colSpan === 1) {
        return sortedData.map((item, index) => {
          return <MyCard key={rowKey ? item[rowKey] || index : index} item={item} />;
        });
      } else {
        const groupData = groupByColSpan(sortedData, colSpan);
        return groupData.map((group, gIndex) => {
          return (
            <div className={cn("flex items-center justify-between space-x-1", cardOptions?.cardGroupClassName)} key={gIndex}>
              {group.map((item, index) => {
                return <MyCard key={rowKey ? item[rowKey] || index : index} item={item} />;
              })}
            </div>
          );
        });
      }
    },
    [sortedData]
  );
  return (
    <div className={className}>
      {sortedData.length > 0 ? (
        <VList
          style={{ height: virtualizedOptions?.vListHeight || 400 }}
          onRangeChange={async (_, endIndex) => {
            const count = sortedData.length / colSpan;
            if (endIndex + 1 >= count && fetchedCountRef.current < count) {
              fetchedCountRef.current = count;
              if (virtualizedOptions?.fetchData) {
                await virtualizedOptions.fetchData()
              }
            }
          }}
        >
          {elements}
          {isLoading ? loadingContent || DefaultLoading({ loadingOptions }) : null}
        </VList>
      ) : (
        emptyContent ?? <DefaultEmptyContent />
      )}
    </div>
  );
}

function VirtualizedListUI<T>({
  className,
  sortedData,
  dataSource,
  columns,
  columnOptions,
  sortableColumnsMap,
  sortingUIOptions,
  setSortableColumnsMap,
  setSortedData,
  rowKey,
  onRowClick,
  rowCss,
  emptyContent,
  isLoading,
  loadingOptions,
  loadingContent,
  virtualizedOptions,
}: {
  className: string;
  sortedData: T[];
  dataSource: T[];
  columns: Column<T>[];
  columnOptions: ColumnOptions<T>;
  sortableColumnsMap: { [k: string]: 'asc' | 'desc' | 'none' };
  sortingUIOptions: SortingUIOptions;
  setSortableColumnsMap: (value: React.SetStateAction<{
    [k: string]: "asc" | "desc" | "none";
  }>) => void;
  setSortedData: (value: React.SetStateAction<T[]>) => void;
  rowKey?: string;
  onRowClick?: (item: T) => void;
  rowCss?: string | ((item: T) => string | undefined);
  emptyContent?: React.ReactNode;
  isLoading?: boolean;
  loadingOptions?: LoadingOptions;
  loadingContent?: React.ReactNode;
  virtualizedOptions?: VirtualizedOptions;
}) {
  const fetchedCountRef = useRef(-1);
  const elements = useMemo(
    () => sortedData.map((item, index) => {
      return (
        <div
          key={rowKey ? item[rowKey] || index : index}
          className={cn('w-full flex items-center space-x-1', virtualizedOptions?.classNames?.row, typeof rowCss === 'function' ? rowCss(item) : rowCss)}
          onClick={() => {
            onRowClick?.(item);
          }}
        >
          {columns.map((column) => {
            return (
              <div
                key={column.key}
                className={cn('w-full flex-grow py-2 px-4 text-xs whitespace-nowrap overflow-auto', virtualizedOptions?.classNames?.rowCell)}
                style={{
                  minWidth: column.width
                }}
              >
                {column.render ? column.render(item) : renderFieldValue(item[column.key])}
              </div>
            )
          })}
        </div>
      );
    }),
    [sortedData]
  );

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className='inline-block min-w-fit w-full'>
        <div className={cn("w-full flex items-center rounded-lg bg-default-100 space-x-1 mb-2", virtualizedOptions?.classNames?.header)}>
          {columns.map((column) => {
            return (
              <div
                key={column.key}
                className={cn("w-full flex-grow py-2 px-4 flex items-center text-xs font-semibold whitespace-nowrap overflow-auto", virtualizedOptions?.classNames?.headerCell)}
                style={{
                  minWidth: column.width
                }}
              >
                <span>{column.label}</span>
                {!!sortableColumnsMap[column.key] && (
                  <SortingComponent
                    sortingUIOptions={sortingUIOptions}
                    columnOptions={columnOptions}
                    sortableColumnsMap={sortableColumnsMap}
                    item={column}
                    onSort={({ type, key, sortKey }) => {
                      const { sortableColumns, sortedData } = sortData({
                        type,
                        key,
                        sortKey,
                        sortableColumnsMap,
                        dataSource,
                      });
                      setSortableColumnsMap(sortableColumns);
                      setSortedData(sortedData);
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
        {sortedData.length > 0 ? (
          <VList
            style={{ height: virtualizedOptions?.vListHeight || 200 }}
            onRangeChange={async (_, endIndex) => {
              const count = sortedData.length;
              if (endIndex + 1 >= count && fetchedCountRef.current < count) {
                fetchedCountRef.current = count;
                if (virtualizedOptions?.fetchData) {
                  await virtualizedOptions.fetchData()
                }
              }
            }}
          >
            {elements}
            {isLoading ? loadingContent || DefaultLoading({ loadingOptions }) : null}
          </VList>
        ) : (
          emptyContent ?? <DefaultEmptyContent />
        )}
      </div>
    </div>
  )
}

const TableUI = observer(<T,>({
  className,
  classNames = {},
  isHeaderSticky,
  sortedData,
  dataSource,
  columns,
  columnOptions,
  sortableColumnsMap,
  sortingUIOptions,
  setSortableColumnsMap,
  setSortedData,
  isLoading,
  loadingContent,
  loadingOptions,
  emptyContent,
  rowCss,
  onRowClick,
  showCollapsedTables,
  collapsedTableConfig,
  collapsedTables,
  rowKey,
  isServerPaging,
  showPagination,
  pagination = new PaginationState({
    page: 1,
    limit: 10,
  }),
  nextuiPaginationProps = {},
  autoScrollToTop,
  columnSlot,
}: {
  className: string;
  classNames?: TableClassNames;
  isHeaderSticky: boolean;
  sortedData: T[];
  dataSource: T[];
  columns: Column<T>[];
  columnOptions?: ColumnOptions<T>;
  sortableColumnsMap: { [k: string]: 'asc' | 'desc' | 'none' };
  sortingUIOptions: SortingUIOptions;
  setSortableColumnsMap: (value: React.SetStateAction<{ [k: string]: 'asc' | 'desc' | 'none'; }>) => void;
  setSortedData: (value: React.SetStateAction<T[]>) => void;
  isLoading: boolean;
  loadingContent?: React.ReactNode;
  loadingOptions?: LoadingOptions;
  emptyContent?: React.ReactNode;
  rowCss?: string | ((item: T) => string | undefined);
  onRowClick?: (item: T) => void;
  showCollapsedTables: boolean;
  collapsedTableConfig?: CollapsedTableConfig<T>;
  collapsedTables: CollapsedTable<any>[];
  rowKey?: string;
  isServerPaging?: boolean;
  showPagination: boolean;
  pagination?: PaginationState;
  nextuiPaginationProps?: PaginationProps | {};
  autoScrollToTop: boolean;
  columnSlot?: React.ReactNode;
}) => {
  const tableBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isServerPaging) {
      pagination.setData({
        total: dataSource.length,
      });
    }
  }, [dataSource]);

  const data = (isServerPaging || !showPagination) ? sortedData : sortedData.slice(pagination.offset, pagination.offset + pagination.limit);

  return (
    <>
      <div className={cn('relative w-full', className)} ref={tableBoxRef}>
        <table className={cn('w-full h-auto table-auto', classNames.table)}>
          <thead className={cn(classNames.thead, { 'sticky top-0 z-30 [&>tr]:first:shadow-small [&>tr]:first:rounded-lg': isHeaderSticky })}>
            <tr className={classNames.tr}>
              {columns.map((item) => (
                <th
                  key={item.key}
                  className={cn('px-3 h-10 text-xs font-semibold whitespace-nowrap bg-default-100 first:rounded-l-lg last:rounded-r-lg outline-none', classNames.th)}
                  style={{
                    minWidth: item.width
                  }}
                >
                  <div className="flex items-center">
                    <span>{item.label}</span>
                    {!!sortableColumnsMap[item.key] && (
                      <SortingComponent
                        sortingUIOptions={sortingUIOptions}
                        columnOptions={columnOptions}
                        sortableColumnsMap={sortableColumnsMap}
                        item={item}
                        onSort={({ type, key, sortKey }) => {
                          const { sortableColumns, sortedData } = sortData({
                            type,
                            key,
                            sortKey,
                            sortableColumnsMap,
                            dataSource,
                          });
                          setSortableColumnsMap(sortableColumns);
                          setSortedData(sortedData);
                        }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
            <tr aria-hidden="true" className="w-px h-px block ml-[0.25rem] mt-[0.25rem]"></tr>
          </thead>
          {isLoading ? (
            <tbody className={classNames.tbody}>
              <tr className={classNames.tr}>
                <td
                  className={classNames.td}
                  colSpan={columns.length}
                >
                  {loadingContent || DefaultLoading({ loadingOptions })}
                </td>
              </tr>
            </tbody>
          ) : data.length > 0 ? (
            <tbody className={classNames.tbody}>
              {
                showCollapsedTables ?
                  data.map(item => {
                    return (
                      <CollapseBodyRow
                        classNames={classNames}
                        item={item}
                        columns={columns}
                        rowCss={rowCss}
                        onRowClick={onRowClick}
                        collapsedTableConfig={collapsedTableConfig}
                        collapsedTables={collapsedTables}
                      />
                    )
                  })
                  : data.map((item, index) => {
                    return (
                      <>
                        <tr
                          key={rowKey ? item[rowKey] || index : index}
                          className={cn(classNames.tr, typeof rowCss === 'function' ? rowCss(item) : rowCss)}
                          onClick={() => {
                            onRowClick?.(item);
                          }}
                        >
                          {columns.map((column) => {
                            return (
                              <td
                                key={column.key}
                                className={cn('py-2 px-3 text-xs', classNames.td)}
                                style={{
                                  minWidth: column.width
                                }}
                              >
                                {column.render ? column.render(item) : renderFieldValue(item[column.key])}
                              </td>
                            )
                          })}
                        </tr>
                        {columnSlot && <tr><td colSpan={columns.length}>{columnSlot}</td></tr>}
                      </>
                    );
                  })
              }
            </tbody>
          ) : (
            <tbody className={classNames.tbody}>
              <tr className={classNames.tr}>
                <td
                  className={classNames.td}
                  colSpan={columns.length}
                >
                  {emptyContent ?? <DefaultEmptyContent />}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {showPagination && pagination.total > pagination.limit && (
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
})

function DefaultLoading({ loadingOptions }: { loadingOptions?: LoadingOptions }) {
  const type = loadingOptions?.type || 'skeleton';
  const skeletonOptions = loadingOptions?.skeleton;
  const spinnerOptions = loadingOptions?.spinner;
  const spinnerProps = spinnerOptions?.spinnerProps || {};

  if (type === 'skeleton') {
    return <SkeletonBox className={cn('mt-2 flex-col', skeletonOptions?.boxClassName)} skClassName={cn('h-[30px] rounded', skeletonOptions?.skeletonClassName)} line={skeletonOptions?.line || 5} />;
  }

  return (
    <div className={cn('w-full h-[60px] flex justify-center items-center', spinnerOptions?.boxClassName)}>
      <Spinner size="sm" color="primary" {...spinnerProps} />
      <div className={cn('ml-2 text-[#64748B] text-sm', spinnerOptions?.textClassName)}>{spinnerOptions?.text || 'Loading...'}</div>
    </div>
  );
}

function DefaultEmptyContent() {
  return <div className="w-full h-[60px] flex justify-center items-center text-xs text-[#64748B] dark:text-[#cacaca]">No Data</div>;
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

function CollapseBodyRow<T>({
  classNames,
  item,
  columns,
  rowCss,
  onRowClick,
  collapsedTableConfig,
  collapsedTables,
}: {
  classNames?: TableClassNames;
  item: T;
  columns: Column<T>[];
  rowCss?: string | ((item: T) => string | undefined),
  onRowClick?: (item: T) => void;
  collapsedTableConfig?: {
    classNames?: TableClassNames;
    collapsedHandlerPosition?: 'left' | 'right';
    collapsedHandlerBoxCss?: string;
    openedIcon?: React.ReactNode;
    closedIcon?: React.ReactNode;
    onRowClick?: (item: any) => void;
    rowCss?: string | ((item: any) => string | undefined);
    emptyContent?: React.ReactNode;
  };
  collapsedTables: CollapsedTable<any>[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const collapsedHandlerPosition = collapsedTableConfig?.collapsedHandlerPosition || 'right';

  const { OpenedIcon, ClosedIcon } = useMemo(() => {
    const defaultOpenedIcon = <ChevronDown size={18} />;
    const defaultClosedIcon = collapsedHandlerPosition === 'left' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />;
    return {
      OpenedIcon: collapsedTableConfig?.openedIcon || defaultOpenedIcon,
      ClosedIcon: collapsedTableConfig?.closedIcon || defaultClosedIcon,
    };
  }, []);

  return (
    <>
      <tr
        className={cn('text-xs cursor-pointer', classNames?.tr, typeof rowCss === 'function' ? rowCss(item) : rowCss)}
        onClick={(e: any) => {
          onRowClick?.(item);
        }}
      >
        {columns.map((column) => {
          if (column.key === '$collapsedHandler') {
            return (
              <td
                className={classNames?.td}
                style={{
                  minWidth: column.width
                }}
              >
                <div
                  className={cn("w-6 h-6 flex items-center justify-center rounded-sm hover:bg-[#f3f3f4] dark:hover:bg-[#1e1e1e]", collapsedTableConfig?.collapsedHandlerBoxCss)}

                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((v) => !v);
                  }}
                >
                  {isOpen ? OpenedIcon : ClosedIcon}
                </div>
              </td>
            );
          }
          return (
            <td
              key={column.key}
              className={cn("py-2 px-3 text-xs", classNames?.td)}
              style={{
                minWidth: column.width
              }}
            >
              {column.render ? column.render(item) : renderFieldValue(item[column.key])}
            </td>
          );
        })}
      </tr>
      <tr className={cn(classNames?.tr, isOpen ? 'table-row' : 'hidden')}>
        <td colSpan={columns.length} className={cn("py-2 px-3 text-xs", classNames?.td)}>
          {collapsedTables.map((ex) => {
            const exColumns = ex.columns;
            const exData = item[ex.key] || [];
            return (
              <table className={cn("w-full h-auto table-auto", collapsedTableConfig?.classNames?.table)} key={ex.key}>
                <thead className={collapsedTableConfig?.classNames?.thead}>
                  <tr className={collapsedTableConfig?.classNames?.tr}>
                    {exColumns?.map((exC) => {
                      return (
                        <th
                          key={exC.key}
                          className={cn('px-3 h-10 text-xs text-left font-semibold bg-default-100 first:rounded-l-lg last:rounded-r-lg outline-none', collapsedTableConfig?.classNames?.th)}
                          style={{
                            minWidth: exC.width
                          }}
                        >
                          {exC.label}
                        </th>
                      );
                    })}
                  </tr>
                  <tr aria-hidden="true" className="w-px h-px block ml-[0.25rem] mt-[0.25rem]"></tr>
                </thead>
                {exData.length > 0 ? (
                  <tbody className={collapsedTableConfig?.classNames?.tbody}>
                    {
                      exData.map((exItem) => (
                        <tr
                          key={exItem.key}
                          className={cn('text-xs',
                            collapsedTableConfig?.classNames?.tr,
                            typeof collapsedTableConfig?.rowCss === 'function'
                              ? collapsedTableConfig?.rowCss({
                                ...exItem,
                                $parent: item,
                              })
                              : collapsedTableConfig?.rowCss
                          )}
                          onClick={(e: any) => {
                            collapsedTableConfig?.onRowClick?.({
                              ...exItem,
                              $parent: item,
                            });
                          }}
                        >
                          {exColumns?.map((exC) => {
                            return (
                              <td
                                key={exC.key}
                                className={cn('py-2 px-3 text-xs', collapsedTableConfig?.classNames?.td)}
                                style={{
                                  minWidth: exC.width
                                }}
                              >
                                {exC.render
                                  ? exC.render({
                                    ...exItem,
                                    $parent: item,
                                  })
                                  : renderFieldValue(exItem[exC.key])}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    }
                  </tbody>
                ) : (
                  <tbody className={collapsedTableConfig?.classNames?.tbody}>
                    <tr className={collapsedTableConfig?.classNames?.tr}>
                      <td
                        className={collapsedTableConfig?.classNames?.td}
                        colSpan={columns.length}
                      >
                        {collapsedTableConfig?.emptyContent ?? <DefaultEmptyContent />}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            );
          })}
        </td>
      </tr>
    </>
  )
}

function groupByColSpan(arr: any[], colSpan: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += colSpan) {
    result.push(arr.slice(i, i + colSpan));
  }
  return result;
}