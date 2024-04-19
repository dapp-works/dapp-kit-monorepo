import React from 'react';
import { ChartBox } from '../ChartBox';
import { cn } from '../../../lib/utils';

export type CountCard = ChartBox & {
  type?: 'CountCard';
  summedColumnIndex?: string;
};

export const CountCard = (props: CountCard) => {
  if (!props.data?.length) {
    return (
      <ChartBox {...props}>
        <div className={cn("mt-2 ml-2 text-2xl overflow-auto", props.chartClassName)}>
          <span className="text-gray-400">No data</span>
        </div>
      </ChartBox>
    );
  }

  if (!props.summedColumnIndex) {
    return (
      <ChartBox {...props}>
        <div className={cn("mt-2 ml-2 text-2xl overflow-auto", props.chartClassName)}>
          <span className="text-gray-400 text-sm">
            set <span className="font-bold">summedColumnIndex</span> to sum up values
          </span>
        </div>
      </ChartBox>
    );
  }

  const sum = props.data.reduce((acc, cur) => {
    const v = cur[props.summedColumnIndex];
    if (typeof v == 'number') {
      return acc + v;
    } else {
      return acc;
    }
  }, 0);

  return (
    <ChartBox {...props}>
      <div className={cn("mt-2 ml-2 font-bold text-2xl overflow-auto", props.chartClassName)}>{sum}</div>
    </ChartBox>
  );
};