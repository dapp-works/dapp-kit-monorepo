import 'maplibre-gl/dist/maplibre-gl.css';
import MapGL, { Source, Layer, FullscreenControl, NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/dappkit/lib/utils';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export type HeatMapProps = {
  className?: string;
  gridH?: number;
}

const HeatMap = (props: HeatMapProps) => {
  const { gridH, className } = props;
  const MAX_ZOOM_LEVEL = 9;
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    /* global fetch */
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then((resp) => resp.json())
      .then((json) => {
        // Note: In a real application you would do a validation of JSON data before doing anything with it,
        // but for demonstration purposes we ingore this part here and just trying to select needed data...
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
      })
      .catch((err) => console.error('Could not load data', err)); // eslint-disable-line
  }, []);

  const sourceData = useMemo(() => {
    return allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  // const colors = [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor()];

  const colors = ['#7C9DF2', '#35803F', '#A26699', '#44D457', '#37F8E3'];

  // console.log(colors);
  return (
    <div className={cn(`relative w-full`, className)}>
      <MapGL
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3,
        }}
        mapStyle={`https://api.maptiler.com/maps/basic-v2${theme === 'dark' ? '-dark' : ''}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_APIKEY}`}
        attributionControl={false}
      >
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {sourceData && (
          <Source type="geojson" data={sourceData}>
            <Layer
              {...{
                id: 'heatmap',
                maxzoom: MAX_ZOOM_LEVEL,
                type: 'heatmap',
                paint: {
                  // Increase the heatmap weight based on frequency and property magnitude
                  'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
                  // Increase the heatmap color weight weight by zoom level
                  // heatmap-intensity is a multiplier on top of heatmap-weight
                  'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
                  // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                  // Begin color ramp at 0-stop with a 0-transparancy color
                  // to create a blur-like effect.
                  'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(38, 16, 115,0)', 0.2, colors[0], 0.4, colors[1], 0.6, colors[2], 0.8, colors[3], 0.9, colors[4]],
                  // Adjust the heatmap radius by zoom level
                  'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
                  // Transition from heatmap to circle layer by zoom level
                  'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
                },
                source: '',
              }}
            />
          </Source>
        )}
      </MapGL>
    </div>
  );
};

export default HeatMap;

function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter((feature) => {
    const featureDate = new Date(feature.properties.time);
    return featureDate.getFullYear() === year && featureDate.getMonth() === month && featureDate.getDate() === day;
  });
  return { type: 'FeatureCollection', features };
}
