import { Grid } from '@tremor/react';
import { BarChartCard } from './BarChartCard';
import { LineChartCard } from './LineChartCard';
import { AreaChartCard } from './AreaChartCard';
import { DonutChartCard } from './DonutChartCard';
import { CountCard } from './CountCard';
import { TableCard } from './TableCard';
import { MapCard } from './MapCard';

export type JSONMetricsViewType = AreaChartCard | LineChartCard | BarChartCard | DonutChartCard | CountCard | TableCard | MapCard;

const components = {
  AreaChartCard,
  LineChartCard,
  BarChartCard,
  DonutChartCard,
  CountCard,
  TableCard,
  MapCard,
};

const JSONMetricsView = ({ data }: { data: JSONMetricsViewType[] }) => {
  return (
    <Grid numItems={1} numItemsSm={1} numItemsLg={2} numItemsMd={2} className="gap-2">
      {data.map((item, index) => {
        const Component = components[item.type];
        // @ts-ignore
        return <Component {...item} key={index} />;
      })}
    </Grid>
  );
};

export const MetricsView = ({ data }: { data: JSONMetricsViewType }) => {
  const Comp = components[data.type];
  // @ts-ignore
  return <Comp {...data} />;
};

export default JSONMetricsView;
