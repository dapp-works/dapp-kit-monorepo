import { BarChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type BarChartCard = ChartBox & {
  type: 'BarChartCard',
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  showLegend?: boolean;
  showGridLines?: boolean;
  stack?: boolean;
}

export const BarChartCard = (props: BarChartCard) => {
  const {
    data = [], loading = false, categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`,
    showLegend = false, showGridLines = false, stack = false
  } = props;

  return (
    <ChartBox {...props}>
      <BarChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={['indigo', 'cyan', "teal", "green", "yellow", "orange", "red"]}
        valueFormatter={valueFormatter}
        yAxisWidth={48}
        showLegend={showLegend}
        showGridLines={showGridLines}
        stack={stack}
      />
    </ChartBox>
  );
};
