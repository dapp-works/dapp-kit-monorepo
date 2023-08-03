import { useMemo } from 'react';
import { MarkersMapProps } from './Markers';

const verifyCoordinates = (data: { [x: string]: any }[], longitudeIndex: string | number, latitudeIndex: string | number) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (i === 0) {
      if (item[longitudeIndex]) {
        if (isNaN(Number(item[longitudeIndex]))) {
          return `The value of "${longitudeIndex}" is not a number, please select the appropriate longitude field.`
        }
      } else {
        return `Please make sure your data contains "${longitudeIndex}" field.`
      }
      if (item[latitudeIndex]) {
        if (isNaN(Number(item[latitudeIndex]))) {
          return `The value of "${latitudeIndex}" is not a number, please select the appropriate latitude field.`
        }
      } else {
        return `Please make sure your data contains "${latitudeIndex}" field.`
      }
    }
    if (item[longitudeIndex] < -180 || item[longitudeIndex] > 180) {
      return `Please make sure your data contains valid "${longitudeIndex}" field. (value should be between -180 and 180)`
    }
    if (item[latitudeIndex] < -90 || item[latitudeIndex] > 90) {
      return `Please make sure your data contains valid "${latitudeIndex}" field. (value should be between -90 and 90)`
    }
  }
  return '';
}

const MarkersMapVerify = (props: MarkersMapProps & { children?: JSX.Element }) => {
  const { data, longitudeIndex = 'longitude', latitudeIndex = 'latitude', children } = props;

  const errMsg = useMemo(() => {
    return verifyCoordinates(data, longitudeIndex, latitudeIndex);
  }, [data, longitudeIndex, latitudeIndex]);

  if (errMsg) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-red-500">
        {errMsg}
      </div>
    )
  }

  return children;
};

export default MarkersMapVerify;