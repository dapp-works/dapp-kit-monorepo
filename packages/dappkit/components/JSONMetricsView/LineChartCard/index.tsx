import React from 'react';
import { LineChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { cn } from '../../../lib/utils';

export type LineChartCard = ChartBox & {
  type?: 'LineChartCard';
  categories?: string[];
  index?: string;
  curveType?: 'linear' | 'step' | 'monotone';
  colors?: (
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose'
  )[];
  showLegend?: boolean;
  showGridLines?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  showTooltip?: boolean;
  showAnimation?: boolean;
  autoMinValue?: boolean;
  valueFormatter?: ValueFormatter;
};

export const LineChartCard = (props: LineChartCard) => {
  const {
    data = [],
    categories = ['value'],
    index = 'date',
    curveType = 'linear',
    colors = ['indigo', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'slate', 'violet', 'rose', 'pink', 'purple', 'blue'],
    showLegend = false,
    showGridLines = false,
    chartClassName,
    showXAxis = true,
    showYAxis = true,
    startEndOnly = false,
    showTooltip = true,
    showAnimation = true,
    autoMinValue = true,
    valueFormatter = (number) => `${number}`,
  } = props;

  return (
    <ChartBox {...props}>
      <LineChart
        className={cn('h-72 mt-4', chartClassName)}
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        curveType={curveType}
        showXAxis={showXAxis}
        showYAxis={showYAxis}
        startEndOnly={startEndOnly}
        showTooltip={showTooltip}
        showAnimation={showAnimation}
        autoMinValue={autoMinValue}
      />
    </ChartBox>
  );
};
