import { LineChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type LineChartCard = ChartBox & {
  type: 'LineChartCard';
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  showLegend?: boolean;
  showGridLines?: boolean;
  curveType?: 'linear' | 'natural' | 'step'
}

export const LineChartCard = (props: LineChartCard) => {
  const {
    data = [], loading = false, categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`,
    showLegend = false, showGridLines = false, curveType = 'linear'
  } = props;

  return (
    <ChartBox {...props}>
      <LineChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={['indigo', 'cyan', "teal", "green", "yellow", "orange", "red"]}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        curveType={curveType}
      />
    </ChartBox>
  );
};
