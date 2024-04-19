import React from 'react';
import { BarChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { cn } from '../../../lib/utils';

export type BarChartCard = ChartBox & {
  type?: 'BarChartCard';
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  showLegend?: boolean;
  showGridLines?: boolean;
  stack?: boolean;
  showAnimation?: boolean;
};

export const BarChartCard = (props: BarChartCard) => {
  const {
    data = [],
    categories = ['value'],
    index = 'date',
    valueFormatter = (number) => `${number}`,
    showLegend = false,
    showGridLines = false,
    stack = false,
    chartClassName,
    showAnimation = true,
  } = props;

  return (
    <ChartBox {...props}>
      <BarChart
        className={cn('h-72 mt-4', chartClassName)}
        data={data}
        index={index}
        categories={categories}
        colors={['indigo', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'slate', 'violet', 'rose', 'pink', 'purple', 'blue']}
        valueFormatter={valueFormatter}
        yAxisWidth={48}
        showLegend={showLegend}
        showGridLines={showGridLines}
        stack={stack}
        showAnimation={showAnimation}
      />
    </ChartBox>
  );
};
