import React from 'react';
import { ChartBox } from '../ChartBox';

export type CountCard = ChartBox & {
  type?: 'CountCard';
};

export const CountCard = (props: CountCard) => {
  if (!props.data?.length) {
    return (
      <ChartBox {...props}>
        <div className="mt-2 ml-2 text-2xl overflow-auto">
          <span className="text-gray-400">No data</span>
        </div>
      </ChartBox>
    )
  }

  const value = Object.values(props.data[0])[0];
  return (
    <ChartBox {...props}>
      <div className="mt-2 ml-2 font-bold text-2xl overflow-auto">{renderValue(value)}</div>
    </ChartBox>
  );
};

function renderValue(v: any) {
  if (typeof v == 'string' || typeof v == 'number') {
    return v;
  }
  return JSON.stringify(v);
}
