import { ChartBox } from '../ChartBox';
import { HeatMapProps } from './HeatMap';
import MarkersMap, { MarkersMapProps } from './Markers';

const components = {
  MarkersMap,
};

export type MapCard = ChartBox & {
  type: 'MapCard';
  category?: 'MarkersMap';
} & (MarkersMapProps)

export const MapCard = (props: MapCard) => {
  const { category = 'MarkersMap' } = props;
  const Comp = components[category];
  return (
    <ChartBox {...props}>
      {/* @ts-ignore */}
      <Comp {...props} />
    </ChartBox>
  )
};