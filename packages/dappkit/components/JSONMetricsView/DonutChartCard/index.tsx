import React from 'react';
import { DonutChart, ValueFormatter } from '@tremor/react';
import { ChartBox } from '../ChartBox';

export type DonutChartCard = ChartBox & {
  type?: 'DonutChartCard',
  categories?: string[];
  index?: string;
  valueFormatter?: ValueFormatter;
  showLabel?: boolean;
  variant?: 'donut' | 'pie'
}

export const DonutChartCard = (props: DonutChartCard) => {
  const { data = [], categories = ['value'], index = 'name', valueFormatter = (number) => `${number}`, showLabel = true, variant = 'donut' } = props;
  const category = categories[0];
  return (
    <ChartBox {...props}>
      <DonutChart
        className="h-72 mt-4"
        data={data}
        index={index}
        category={category}
        colors={["indigo", "cyan", "teal", "green", "yellow", "orange", "red", "slate", "violet", "rose", "pink", "purple", "blue"]}
        valueFormatter={valueFormatter}
        showLabel={showLabel}
        variant={variant}
      />
    </ChartBox>
  );
};
