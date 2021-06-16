import { Marker, Polyline } from 'react-leaflet';
import { createLineAnchorIcon } from '../../components/MarkerIcons';
import { inBounds, fitInBounds } from '../../components/Bounds';

let Lines = ({
  lines,
  markers,
  updateLine,
  setSelectedLine,
  handleContext,
}) => {
  return (
    <>
      {markers && lines
        ? lines.map((line) => {
            return (
              <Line
                line={line}
                markers={markers}
                updateLine={updateLine}
                setSelectedLine={setSelectedLine}
                handleContext={handleContext}
              />
            );
          })
        : null}
    </>
  );
};

let Line = ({
  line,
  markers,
  updateLine,
  setSelectedLine,
  handleContext,
}) => {
  const startMarker = markers.find((m) => m.id === line.PointStartId);
  const endMarker = markers.find((m) => m.id === line.PointEndId);

  var positions = [
    [startMarker.y, startMarker.x],
    ...line.path.map((elem) => {
      return [elem[0], elem[1]];
    }),
    [endMarker.y, endMarker.x],
  ];
  return (
    <>
      {positions.map((pos, idx) => {
        if (0 < idx && idx < positions.length - 1) {
          return (
            <Marker
              draggable
              position={pos}
              icon={createLineAnchorIcon()}
              eventHandlers={{
                dragend: (event) => {
                  var coords = event.target._latlng;
                  if (!inBounds(coords)) {
                    coords = fitInBounds(coords);
                  }
                  var path = positions.map((p, i) => {
                    if (i == idx) return [coords.lat, coords.lng];
                    else return p;
                  });
                  path.shift();
                  path.pop();
                  updateLine(line.id, {
                    path: path,
                  });
                },
              }}
            />
          );
        } else {
          return null;
        }
      })}
      <Polyline
        eventHandlers={{
          contextmenu: (event) => {
            setSelectedLine(line);
            event.originalEvent.view.L.DomEvent.stopPropagation(
              event,
            );
            handleContext(event, 'line');
          },
        }}
        positions={positions}
        key={line.id}
        color={'black'}
      />
    </>
  );
};

export default Lines;
