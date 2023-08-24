import { AreaChart, LineChart, Text, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type KPICard = ChartBox & {
  type?: 'KPICard';
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  curveType?: 'linear' | 'natural' | 'step';
  metricTitle?: string;
  metric?: string | number;
  chartType?: 'area' | 'line';
}

export const KPICard = (props: KPICard) => {
  const {
    metricTitle, metric, chartType = 'area', data = [], categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`, curveType = 'linear'
  } = props;

  const ChartComp = chartType === 'area' ? AreaChart : LineChart;

  return (
    <ChartBox {...props}>
      <div className="mt-4 space-x-6 px-2 flex items-center">
        <div className='w-auto'>
          <Text className='whitespace-nowrap'>{metricTitle}</Text>
          <div className='font-bold text-3xl'>{metric ?? '-'}</div>
        </div>
        <ChartComp
          className='overflow-hidden'
          style={{ height: "100px" }}
          data={data}
          index={index}
          categories={categories}
          colors={["indigo", "cyan", "teal", "green", "yellow", "orange", "red", "slate", "violet", "rose", "pink", "purple", "blue"]}
          valueFormatter={valueFormatter}
          curveType={curveType}
          showXAxis={false}
          showGridLines={false}
          startEndOnly={true}
          showYAxis={false}
          showLegend={false}
        />
      </div>
    </ChartBox>
  );
};
