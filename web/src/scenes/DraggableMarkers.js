import { Marker, useMapEvent, Tooltip } from 'react-leaflet';
import {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
} from './MarkerIcons';
import API from '../eventApi/eventApi';

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 * @param {Object[]} editMode Est-ce qu'on est en train d'ajouter un segment à un point déjà existant
 * @param {Function} setEditMode Fonction pour update le state de editMode
 * @param {Object[]} lines La liste des lignes à afficher sur la map
 * @param {Function} setLines Fonction pour update le state de lines
 */
let DraggableMarkers = ({
  markers,
  setMarkers,
  editMode,
  setEditMode,
  lines,
  setLines,
  currentMarker,
  setCurrentMarker,
  setStartPoint,
  startPoint,
}) => {
  //Ajoute un marker
  let addMarker = async (event) => {
    var id = markers.length > 0 ? markers.slice(-1)[0].id + 1 : 0;
    var newMarker = {
      title: 'Point ' + id,
      description: '',
      type: markers.length > 0 ? 'point' : 'start',
      x: event.latlng.lat,
      y: event.latlng.lng,
      frontId: id,
    };
    return API.createMarker(newMarker).then((res) => {
      newMarker.id = res.id;
      setMarkers((current) => [...current, res]);
      setStartPoint(newMarker);
      return newMarker;
    });
  };

  //Ajoute une ligne
  let addLine = (start, end) => {
    var newLines = {
      frontId: lines.length > 0 ? lines.slice(-1)[0].id + 1 : 0,
      PointStartId: start.id,
      PointEndId: end.id,
      path: [
        [start.x, start.y],
        [end.x, end.y],
      ],
    };
    return API.createSegment(newLines).then((res) => {
      newLines.id = res.id;
      setLines((current) => [...current, newLines]);
    });
  };

  //Récupère l'icône en fonction du type du marker
  let getIcon = (marker) => {
    switch (marker.type) {
      case 'start':
        return createStartIcon(marker == currentMarker);
      case 'end':
        return createEndIcon(marker == currentMarker);
      case 'point':
        return createCheckpointIcon(marker == currentMarker);
    }
  };

  //Pour éditer les maps
  let mapEvent = useMapEvent({
    click: (event) => {
      if (
        !(
          event.latlng.lat < 0 ||
          event.latlng.lat > 1 ||
          event.latlng.lng < 0 ||
          event.latlng.lng > 1
        )
      ) {
        if (!markers.length > 0) {
          addMarker(event);
        } else {
          var newMarker = addMarker(event);
          addLine(startPoint, newMarker);
        }
      }
    },
  });

  return (
    <>
      {markers.length > 0 && markers[0][0] !== null
        ? markers.map((item, index) => {
            return (
              <Marker
                draggable={false}
                marker_index={index}
                key={index}
                position={[item.x, item.y]}
                icon={getIcon(item)}
                eventHandlers={{
                  click: () => {
                    {
                      currentMarker
                        ? currentMarker.id == item.id
                          ? setCurrentMarker(null)
                          : setCurrentMarker(item)
                        : setCurrentMarker(item);
                    }
                    if (editMode && item.type != 'start') {
                      setEditMode(false);
                      addLine(startPoint, item);
                      setStartPoint(item);
                    }
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -40]} permanent>
                  {item.title}
                </Tooltip>
              </Marker>
            );
          })
        : null}
    </>
  );
};

export default DraggableMarkers;
