import { useMemo, useState } from 'react';
import { Polyline, useMapEvent } from 'react-leaflet';
import { inBounds } from '../../components/Bounds';

let PreviewLine = ({ from }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  let map = useMapEvent(
    useMemo(
      () => ({
        mousemove: (event) => {
          if (inBounds(event)) {
            setMousePosition({
              x: event.latlng.lat,
              y: event.latlng.lng,
            });
          }
        },
      }),
      [],
    ),
  );

  if (from.length == 0) return <></>;
  var positions = [
    from[from.length - 1],
    [mousePosition.x, mousePosition.y],
  ];

  return (
    <Polyline positions={positions} color={'black'} dashArray={5} />
  );
};

export default PreviewLine;
