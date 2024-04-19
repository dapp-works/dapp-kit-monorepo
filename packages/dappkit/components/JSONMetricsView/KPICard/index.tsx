import React from 'react';
import { AreaChart, LineChart, Text, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { SkeletonBox } from '../../Common/SkeletonBox';
import { cn } from '../../../lib/utils';

export type KPICard = ChartBox & {
  type?: 'KPICard';
  categories?: string[];
  index?: string;
  chartType?: 'area' | 'line';
  curveType?: 'linear' | 'step' | 'monotone';
  metricTitle?: string;
  metric?: string | number;
  valueFormatter?: ValueFormatter;
  loading?: boolean;
};

export const KPICard = (props: KPICard) => {
  const { metricTitle, metric, chartType = 'area', data = [], categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`, curveType = 'linear', loading, chartClassName } = props;

  if (loading) {
    return (
      <ChartBox {...props}>
        <div className="mt-4 space-x-6 px-2 flex items-center">
          <div className="w-auto">
            <Text className="whitespace-nowrap">Loading...</Text>
            <div className="font-bold text-3xl">-</div>
          </div>
          <SkeletonBox className="flex-col w-full" skClassName="h-[100px] overflow-hidden" line={1} />
        </div>
      </ChartBox>
    );
  }

  const ChartComp = chartType === 'area' ? AreaChart : LineChart;

  return (
    <ChartBox {...props}>
      <div className="mt-4 space-x-6 px-2 flex items-center">
        <div className="w-auto">
          <Text className="whitespace-nowrap">{metricTitle}</Text>
          <div className="font-bold text-3xl">{metric ?? '-'}</div>
        </div>
        <ChartComp
          className={cn('h-[100px] overflow-hidden', chartClassName)}
          data={data}
          index={index}
          categories={categories}
          colors={['indigo', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'slate', 'violet', 'rose', 'pink', 'purple', 'blue']}
          valueFormatter={valueFormatter}
          curveType={curveType}
          showXAxis={false}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
          autoMinValue={true}
          showAnimation={true}
        />
      </div>
    </ChartBox>
  );
};
