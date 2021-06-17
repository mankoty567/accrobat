import { Marker, useMapEvent, Tooltip } from 'react-leaflet';
import {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
} from '../../components/MarkerIcons';
import { inBounds, fitInBounds } from '../../components/Bounds';

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Boolean} addingLine Etat pendant lequel nous sommes en train d'ajouter des lignes
 * @param {Boolean} addPreviewLine Etat qui nous indique si nous avons la ligne de preview
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} handleContext Il s'agit d'un eventListener
 * @param {Function} updateMarker Fonction pour modifier les informations du marqueur
 * @param {Boolean} editMode Mode nous permettant d'indiquer que le segment acutel est en cours d'édition
 * @param {Function} setEditMode Fonction pour mettre à jour l'editMode
 * @param {Function} setCurrentMarker Fonction pour définir quel est le marqueur sélectionné
 * @param {Object} currentMarker Le marqueur actuellement sélectionné
 * @param {Function} setContextEvent Fonction pour mettre à jour le contexte de l'événement actuel
 * @param {Object} contextRef L'élément de contexte actuel, pour l'utiliser en objet DOM
 * @param {Boolean} addLine Etat nous permettant d'indiquer si on ajoute la ligne
 * @param {Function} setAddingLine Permet de modifier l'état d'ajout actuel d'une ligne
 * @param {Function} setPreviewLine Permet de modifier l'état d'ajout actuel d'une ligne ou non
 * @param {Object[]} errorMarkers La liste des erreurs lors d'un mauvais placement de marqueur
 * @param {Function} setCurrentObstacle Permet de définir l'obstacle courant
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
  //Variable d'interface
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
