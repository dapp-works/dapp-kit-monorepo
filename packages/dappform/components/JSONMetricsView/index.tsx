import React from 'react';
import { Col, Grid } from '@tremor/react';
import { BarChartCard } from './BarChartCard';
import { LineChartCard } from './LineChartCard';
import { AreaChartCard } from './AreaChartCard';
import { DonutChartCard } from './DonutChartCard';
import { CountCard } from './CountCard';
import { TableCard } from './TableCard';
import { KPICard } from './KPICard';


export type JSONMetricsViewType = AreaChartCard | LineChartCard | BarChartCard | DonutChartCard | CountCard | TableCard | KPICard;

export const components = {
  AreaChartCard,
  LineChartCard,
  BarChartCard,
  DonutChartCard,
  CountCard,
  TableCard,
  KPICard,
};


const JSONMetricsView = ({ data }: { data: JSONMetricsViewType[] }) => {
  return (
    <Grid numItems={1} numItemsSm={1} numItemsLg={2} numItemsMd={2} className="gap-2">
      {data.map((item, index) => {
        //@ts-ignore
        const Component = components[item.type];
        return (
          <Col key={index} numColSpanSm={1} numColSpanMd={item.numColSpanMd ?? 1}>
            {/* @ts-ignore */}
            <Component {...item} />
          </Col>
        );
      })}
    </Grid>
  );
};

export const MetricsView = ({ data }: { data: JSONMetricsViewType }) => {
  //@ts-ignore
  const Comp = components[data.type];
  // @ts-ignore
  return <Comp {...data} />;
};

export { JSONMetricsView };
