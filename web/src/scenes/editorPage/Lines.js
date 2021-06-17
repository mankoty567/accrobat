import { Marker, Polyline } from 'react-leaflet';
import { createLineAnchorIcon } from '../../components/MarkerIcons';
import { inBounds, fitInBounds } from '../../components/Bounds';

/**
 * L'ensemble des lignes au sein de l'éditeur
 * @param {Object[]} lines Les différentes lignes
 * @param {Object[]} markers Les différents markeurs présent sur la carte
 * @param {Function} updateLine Fonction lors d'un update de la ligne
 * @param {Function} setCurrentLine Permet de définir la ligne sélectionnée
 * @param {Function} handleContext Permet de voir ce qui est appelé
 */
let Lines = ({
  lines,
  markers,
  updateLine,
  setCurrentLine,
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
                setCurrentLine={setCurrentLine}
                handleContext={handleContext}
              />
            );
          })
        : null}
    </>
  );
};

/**
 * Correspond à une ligne sur l'interface
 * @param {Object} line La ligne contenant le chemin et les informations relatives
 * @param {Object} markers Les marqueurs présent aux extrémités de la ligne
 * @param {Function} updateLine Fonction lors d'un update de la ligne
 * @param {Function} setCurrentLine Permet de définir la ligne sélectionnée
 * @param {Function} handleContext Il s'agit d'un eventListener
 */
let Line = ({
  line,
  markers,
  updateLine,
  setCurrentLine,
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
              key={pos}
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
            setCurrentLine(line);
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
