import React from 'react';
import { AreaChart, Color, CurveType, CustomTooltipProps, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { cn } from '../../../lib/utils';

export type AreaChartCard = ChartBox & {
  type?: 'AreaChartCard';
  categories?: string[];
  index?: string;
  curveType?: CurveType;
  colors?: (Color | string)[];
  showLegend?: boolean;
  showGridLines?: boolean;
  stack?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  startEndOnly?: boolean;
  showTooltip?: boolean;
  showAnimation?: boolean;
  autoMinValue?: boolean;
  valueFormatter?: ValueFormatter;
  customTooltip?: React.ComponentType<CustomTooltipProps>
};


export const AreaChartCard = (props: AreaChartCard) => {
  const {
    data = [],
    categories = ['value'],
    index = 'date',
    curveType = 'linear',
    colors = ['indigo', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'slate', 'violet', 'rose', 'pink', 'purple', 'blue'],
    showLegend = false,
    showGridLines = false,
    stack = false,
    chartClassName,
    showXAxis = true,
    showYAxis = true,
    startEndOnly = false,
    showTooltip = true,
    showAnimation = true,
    autoMinValue = true,
    valueFormatter = (number) => `${number}`,
    customTooltip,
  } = props;

  return (
    <ChartBox {...props}>
      <AreaChart
        className={cn('h-72 mt-4', chartClassName)}
        data={data}
        index={index}
        categories={categories}
        colors={colors}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        stack={stack}
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

