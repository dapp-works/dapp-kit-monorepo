import { AreaChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';
import { Loader2 } from 'lucide-react';

export type AreaChartCard = ChartBox & {
  type: 'AreaChartCard';
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
    data = [], loading = false, categories = ['value'], index = 'date', valueFormatter = (number) => `${number}`,
    showLegend = false, showGridLines = false, stack = false, curveType = 'linear'
  } = props;

  if (loading) {
    return (
      <ChartBox {...props}>
        <div className="min-h-[100px] flex flex-col items-center justify-center">
          <Loader2 size={24} className="animate-spin" />
        </div>
      </ChartBox>
    );
  }

  return (
    <ChartBox {...props}>
      <AreaChart
        className="h-72 mt-4"
        data={data}
        index={index}
        categories={categories}
        colors={['indigo', 'cyan', "teal", "green", "yellow", "orange", "red"]}
        valueFormatter={valueFormatter}
        showLegend={showLegend}
        showGridLines={showGridLines}
        stack={stack}
        curveType={curveType}
      />
    </ChartBox>
  );
};
