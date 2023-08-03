import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { Marker, GeolocateControl, FullscreenControl, NavigationControl, ScaleControl, Popup } from 'react-map-gl/maplibre';
import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import JSONHighlight from '@/dappkit/components/Common/JSONHighlight';
import MarkersMapVerify from './MarkersMapVerify';
import { useTheme } from 'next-themes';
import { cn } from '@/dappkit/lib/utils';

export type MarkersMapProps = {
  className?: string;
  gridH: number;
  data?: {
    [key: string]: any;
  }[];
  longitudeIndex: string | number;
  latitudeIndex: string | number;
}

const MarkersMap = (props: MarkersMapProps) => {
  const { gridH = 3, className, data, longitudeIndex = 'longitude', latitudeIndex = 'latitude' } = props;
  const [popupInfo, setPopupInfo] = useState(null);
  const { theme } = useTheme();

  const pins = useMemo(
    () =>
      data.map((item, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={item[longitudeIndex]}
          latitude={item[latitudeIndex]}
          anchor="bottom"
          onClick={e => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(item);
          }}
        >
          <MapPin className='text-green-600' size={20} />
        </Marker>
      )),
    []
  );

  return (
    <MarkersMapVerify {...props}>
      <div className={cn(`relative w-full`, className)}
        style={{
          height: `${(132 * gridH) - 80}px`
        }}
      >
        <MapGL
          initialViewState={{
            latitude: 40,
            longitude: -100,
            zoom: 3,
            bearing: 0,
            pitch: 0
          }}
          mapStyle={`https://api.maptiler.com/maps/basic-v2${theme === 'dark' ? '-dark' : ''}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_APIKEY}`}
          attributionControl={false}
        >
          <GeolocateControl position="top-left" />
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />
          {pins}
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo[longitudeIndex])}
              latitude={Number(popupInfo[latitudeIndex])}
              onClose={() => setPopupInfo(null)}
            >
              <JSONHighlight jsonStr={JSON.stringify(popupInfo, null, 2)} />
            </Popup>
          )}
        </MapGL>
      </div>
    </MarkersMapVerify>
  )
};

export default MarkersMap;