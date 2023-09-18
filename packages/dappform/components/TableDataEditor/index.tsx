import "@glideapps/glide-data-grid/dist/index.css";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from "next-themes";
import { DataEditor, GridCellKind, GridColumn, GridColumnIcon, Item } from "@glideapps/glide-data-grid";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import { StarCell, } from "@glideapps/glide-data-grid-cells/dist/ts/cells/star-cell";
import { SparklineCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/sparkline-cell";
import { TagsCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/tags-cell";
import { UserProfileCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/user-profile-cell";
import { RangeCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/range-cell";
import { ArticleCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/article-cell-types";
import { SpinnerCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/spinner-cell";
import { DatePickerCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/date-picker-cell";
import { LinksCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/links-cell";
import { ButtonCell } from "@glideapps/glide-data-grid-cells/dist/ts/cells/button-cell";
import React from "react";

export type TableDataEditorProps<T = { [x: string]: any }> = {
  width?: string | number;
  height?: string | number;
  data: T[];
  columnOptions?: {
    [key in keyof T]?: {
      title?: string;
      hidden?: boolean;
      width?: number;
      hasMenu?: boolean;
      style?: 'normal' | 'highlight';
      icon?: GridColumnIcon | string;
      setCustomCells?: (d) => StarCell | SparklineCell | TagsCell | UserProfileCell | RangeCell | ArticleCell | SpinnerCell | DatePickerCell | LinksCell | ButtonCell;
    }
  }
  onCellClicked?: (d: any) => void;
}

export const TableDataEditor = <T extends {},>(props: TableDataEditorProps<T>) => {
  const { width = '100%', height = 300, data = [], columnOptions, onCellClicked = (d) => { } } = props;
  const { theme } = useTheme();
  const cellProps = useExtraCells();
  const dataEditorTheme = useMemo(() => {
    if (theme === 'light') {
      return {
        accentColor: '#8c96ff',
        accentFg: '#ffffff',
        accentLight: 'rgba(62, 116, 253, 0.1)',
        textDark: '#313139',
        textMedium: '#737383',
        textLight: '#b2b2c0',
        textBubble: '#313139',
        bgIconHeader: '#737383',
        fgIconHeader: '#ffffff',
        textHeader: '#313139',
        textHeaderSelected: '#ffffff',
        textGroupHeader: '#313139bb',
        bgCell: '#ffffff',
        bgCellMedium: '#fafafb',
        bgHeader: '#f7f7f8',
        bgHeaderHasFocus: '#e9e9eb',
        bgHeaderHovered: '#efeff1',
        bgBubble: '#ededf3',
        bgBubbleSelected: '#ffffff',
        bgSearchResult: '#fff9e3',
        borderColor: 'rgba(115, 116, 131, 0.16)',
        horizontalBorderColor: 'rgba(115, 116, 131, 0.16)',
        drilldownBorder: 'rgba(0, 0, 0, 0)',
        linkColor: '#4f5dff',
        cellHorizontalPadding: 8,
        cellVerticalPadding: 3,
        headerFontStyle: '600 0.8125rem',
        baseFontStyle: '0.8125rem',
        fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif;',
      }
    }
    if (theme === 'dark') {
      return {
        accentColor: '#8c96ff',
        accentFg: '#000000',
        accentLight: 'rgba(102, 106, 145, 0.153)',
        textDark: '#ffffff',
        textMedium: '#b8b8b8',
        textLight: '#a0a0a0',
        textBubble: '#ffffff',
        bgIconHeader: '#b8b8b8',
        fgIconHeader: '#000000',
        textHeader: '#a1a1a1',
        textHeaderSelected: '#000000',
        textGroupHeader: '#a1a1a1',
        bgCell: '#16161b',
        bgCellMedium: '#202027',
        bgHeader: '#212121',
        bgHeaderHasFocus: '#151515',
        bgHeaderHovered: '#101010',
        bgBubble: '#212121',
        bgBubbleSelected: '#000000',
        bgSearchResult: '#423c24',
        borderColor: 'rgba(225, 225, 225, 0.2)',
        horizontalBorderColor: 'rgba(225, 225, 225, 0.2)',
        drilldownBorder: 'rgba(225, 225, 225, 0.4)',
        linkColor: '#4f5dff',
        cellHorizontalPadding: 8,
        cellVerticalPadding: 3,
        headerFontStyle: '600 0.8125rem',
        baseFontStyle: '0.8125rem',
        fontFamily: 'Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif;',
      }
    }
    return {}
  }, [theme]);

  const [columns, setColumns] = useState<GridColumn[]>([]);

  useEffect(() => {
    if (data?.length > 0) {
      const _keys = columnOptions ? Object.keys(data[0]).filter(key => !columnOptions[key]?.hidden) : Object.keys(data[0]);
      const columns: GridColumn[] = _keys.map((key) => ({
        id: key,
        title: columnOptions?.[key]?.title || key,
        width: columnOptions?.[key]?.width,
        hasMenu: columnOptions?.[key]?.hasMenu,
        style: columnOptions?.[key]?.style,
        icon: columnOptions?.[key]?.icon,
      }));
      setColumns(columns);
    }
  }, [data, columnOptions]);

  const keys = useMemo(() => {
    return columns.map((c) => c.id);
  }, [columns]);

  const getData = useCallback((cell: Item) => {
    if (columns.length > 0) {
      const [col, row] = cell;
      const dataRow = data[row];
      const k = keys[col] as string;
      const d = dataRow[k];
      if (columnOptions?.[k]?.setCustomCells) {
        return columnOptions[k].setCustomCells(d);
      } else {
        const kind = GridCellKind.Text;
        let displayData = d;
        if (typeof d == 'string' || typeof d == 'number') {
          displayData = d.toString();
        } else if (d == null) {
          displayData = '';
        } else {
          displayData = JSON.stringify(d);
        }
        return {
          kind,
          displayData,
          data: d,
          allowOverlay: false,
        };
      }
    }
  }, [columns, keys, data]);

  const onColumnResize = useCallback((column: GridColumn, newSize: number) => {
    setColumns(prevCols => {
      const index = prevCols.findIndex(c => c.id === column.id);
      const newArray = [...prevCols];
      newArray.splice(index, 1, {
        ...prevCols[index],
        width: newSize,
      });
      return newArray;
    });
  }, []);

  return (
    <DataEditor
      {...cellProps}
      width={width}
      height={height}
      getCellContent={getData}
      columns={columns}
      rows={data.length}
      rowMarkers="number"
      smoothScrollY={true}
      smoothScrollX={true}
      theme={dataEditorTheme}
      onColumnResize={onColumnResize}
      getCellsForSelection={true}
      onCellClicked={(cell) => {
        const [col, row] = cell;
        const dataRow = data[row];
        // @ts-ignore
        const d = dataRow[keys[col]];
        onCellClicked(d);
      }}
    />
  );
};
