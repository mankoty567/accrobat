import { Marker, useMapEvent, Tooltip } from 'react-leaflet';
import {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
} from '../../components/MarkerIcons';
import { inBounds, fitInBounds } from '../../components/Bounds';

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 * @param {Object[]} editMode Est-ce qu'on est en train d'ajouter un segment à un point déjà existant
 * @param {Function} setEditMode Fonction pour update le state de editMode
 * @param {Object[]} lines La liste des lignes à afficher sur la map
 */
let Markers = ({
  addingLine,
  addPreviewLine,
  markers,
  handleContext,
  updateMarker,
  editMode,
  setEditMode,
  setCurrentMarker,
  currentMarker,
  setContextEvent,
  contextRef,
  addLine,
  setAddingLine,
  setPreviewLine,
  errorMarkers,
  setCurrentObstacle,
}) => {
  //Récupère l'icône en fonction du type du marker
  let getIcon = (marker) => {
    var error = errorMarkers.filter((val) => {
      if (val.id == marker.id) return val;
    });
    switch (marker.type) {
      case 'start':
        return createStartIcon(
          marker == currentMarker,
          error.length > 0,
        );
      case 'end':
        return createEndIcon(
          marker == currentMarker,
          error.length > 0,
        );
      case 'point':
        return createCheckpointIcon(
          marker == currentMarker,
          error.length > 0,
        );
    }
  };

  //Pour éditer les maps
  let map = useMapEvent({
    click: async (event) => {
      if (event.originalEvent.target !== contextRef.current) {
        setContextEvent(undefined);
      }
      if (addingLine) {
        addPreviewLine(event);
      }
    },
    contextmenu: (event) => {
      if (event.originalEvent.target !== contextRef.current) {
        setContextEvent(undefined);
      }
      if (inBounds(event)) {
        if (addingLine) {
          handleContext(event, 'addingLine');
        } else {
          handleContext(event, 'map');
        }
      }
    },
  });

  return (
    <>
      {markers.length > 0 && markers[0][0] !== null
        ? markers.map((item) => {
            return (
              <Marker
                draggable={true}
                marker_index={item.id}
                key={item.id}
                position={[item.y, item.x]}
                icon={getIcon(item)}
                eventHandlers={{
                  click: () => {
                    var newCurrent = item;
                    if (currentMarker) {
                      if (currentMarker.id === item.id && editMode)
                        newCurrent = null;
                    }
                    setCurrentMarker(newCurrent);
                    setCurrentObstacle(null);
                    if (addingLine) {
                      if (currentMarker.id !== item.id)
                        addLine(currentMarker, item);
                      setAddingLine(false);
                      setPreviewLine([]);
                    }
                  },
                  dragend: (event) => {
                    var coords = event.target._latlng;
                    if (!inBounds(coords)) {
                      coords = fitInBounds(coords);
                    }
                    updateMarker(item.id, {
                      x: coords.lng,
                      y: coords.lat,
                    });
                    setEditMode(false);
                  },
                  contextmenu: (event) => {
                    var newCurrent = item;
                    if (currentMarker) {
                      if (currentMarker.id === item.id && editMode)
                        newCurrent = null;
                    }
                    setCurrentMarker(newCurrent);
                    if (!addingLine) handleContext(event, 'marker');
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

export default Markers;
