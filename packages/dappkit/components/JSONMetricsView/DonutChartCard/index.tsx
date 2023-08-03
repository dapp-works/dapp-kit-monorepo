import { DonutChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type DonutChartCard = ChartBox & {
  type: 'DonutChartCard',
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
}

export const DonutChartCard = (props: DonutChartCard) => {
  const { data = [], categories = ['value'], index = 'name', valueFormatter = (number) => `${number}` } = props;
  const category = categories[0];
  return (
    <ChartBox {...props}>
      <DonutChart
        className="h-72 mt-4"
        data={data}
        index={index}
        category={category}
        colors={["slate", "violet", "indigo", "rose", "cyan", "teal", "green", "yellow", "orange", "red"]}
        valueFormatter={valueFormatter}
      />
    </ChartBox>
  );
};
