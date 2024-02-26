import React from 'react';
import { AreaChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type AreaChartCard = ChartBox & {
  type?: 'AreaChartCard';
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  showLegend?: boolean;
  showGridLines?: boolean;
  stack?: boolean;
  curveType?: 'linear' | 'natural' | 'step'
}

export const AreaChartCard = (props: AreaChartCard) => {
  const {
    data = [], categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`,
    showLegend = false, showGridLines = false, stack = false, curveType = 'linear'
  } = props;

  return (
    <ChartBox {...props}>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={["indigo", "cyan", "teal", "green", "yellow", "orange", "red", "slate", "violet", "rose", "pink", "purple", "blue"]}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        stack={stack}
        curveType={curveType}
      />
    </ChartBox>
  );
};
