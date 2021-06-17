import { Marker, Tooltip } from 'react-leaflet';
import { createObstacleIcon } from '../../components/MarkerIcons';
import placeOnSegment from '../../components/PlaceOnSegments';

/**
 * Il s'agit de l'objet obstacle sur la carte
 * @param {Object[]} obstacles La liste de tout les obstacles présent sur la carte
 * @param {Object} currentObstacle L'obstacle actuellement sélectionné
 * @param {Object[]} lines La liste de toutes les lignes présente sur la map
 * @param {Function} getMarkerCoordsFromId Fonction pour récupérer les coordonnées selon l'id
 * @param {Function} handleContext Il s'agit d'un eventListener
 * @param {Function} setCurrentMarker Fonction pour définir le marqueur courant
 * @param {Function} setCurrentObstacle Fonction qui permet de définir l'obstacle courant
 */
let Obstacles = ({
  obstacles,
  currentObstacle,
  lines,
  getMarkerCoordsFromId,
  handleContext,
  setCurrentMarker,
  setCurrentObstacle,
}) => {
  return (
    <>
      {obstacles.map((item) => {
        var segment = lines.find((l) => l.id == item.SegmentId);
        var pointStart = getMarkerCoordsFromId(segment.PointStartId);
        var pointEnd = getMarkerCoordsFromId(segment.PointEndId);
        var positions = [
          [pointStart[1], pointStart[0]],
          ...segment.path.map((elem) => {
            return [elem[0], elem[1]];
          }),
          [pointEnd[1], pointEnd[0]],
        ];
        var coords = placeOnSegment(positions, item.distance);
        item.x = coords[1];
        item.y = coords[0];

        return (
          <Marker
            eventHandlers={{
              click: () => {
                var newCurrent = item;
                if (currentObstacle) {
                  if (currentObstacle.id === item.id)
                    newCurrent = null;
                }
                setCurrentMarker(null);
                setCurrentObstacle(newCurrent);
              },
              contextmenu: (event) => {
                setCurrentObstacle(item);
                event.originalEvent.view.L.DomEvent.stopPropagation(
                  event,
                );
                handleContext(event, 'obstacle');
              },
            }}
            draggable={false}
            key={item.id}
            position={[item.y, item.x]}
            icon={createObstacleIcon(
              item.type == 'question',
              item === currentObstacle,
            )}
          >
            <Tooltip direction="top" offset={[0, -15]} permanent>
              {item.title}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};

export default Obstacles;
