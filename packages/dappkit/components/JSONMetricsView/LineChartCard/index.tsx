import React from 'react';
import { Color, CurveType, CustomTooltipProps, LineChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { cn } from '../../../lib/utils';

export type LineChartCard = ChartBox & {
  type?: 'LineChartCard';
  categories?: string[];
  index?: string;
  curveType?: CurveType;
  colors?: (Color | string)[];
  showLegend?: boolean;
  showGridLines?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  showTooltip?: boolean;
  showAnimation?: boolean;
  autoMinValue?: boolean;
  valueFormatter?: ValueFormatter;
  customTooltip?: React.ComponentType<CustomTooltipProps>;
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
    customTooltip
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
        customTooltip={customTooltip}
      />
    </ChartBox>
  );
};
