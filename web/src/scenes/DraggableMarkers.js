import {
  Marker,
  useMapEvent,
  Tooltip
} from 'react-leaflet';
import{createCheckpointIcon, createEndIcon, createStartIcon} from './MarkerIcons'

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 * @param {Object[]} editMode Est-ce qu'on est en train d'ajouter un segment à un point déjà existant
 * @param {Function} setEditMode Fonction pour update le state de editMode
 * @param {Object[]} lines La liste des lignes à afficher sur la map
 * @param {Function} setLines Fonction pour update le state de lines
 */
let DraggableMarkers = ({ markers, setMarkers, editMode, setEditMode, lines, setLines, currentMarker, setCurrentMarker, setStartPoint, startPoint, mousePosition, setMousePosition }) => {

  //Ajoute un marker
  let addMarker = (event) => {
    var id = markers.length > 0 ? markers.slice(-1)[0].id + 1 : 0;
    var newMarker = {
      'id': id,
      'title': 'Point ' + id,
      'description': '',
      'type': markers.length > 0 ? 'point' : 'start',
      'x': event.latlng.lat,
      'y': event.latlng.lng
    };
    setMarkers((current) => [...current, newMarker]);
    setStartPoint(newMarker);
    return newMarker;
  };

  let inBounds = (event) => {
    return!(
      event.latlng.lat < 0 ||
      event.latlng.lat > 1 ||
      event.latlng.lng < 0 ||
      event.latlng.lng > 1
    );
  }

  //Ajoute une ligne
  let addLine = (start, end) => {
    var newLines = {
      'id': lines.length > 0 ? lines.slice(-1)[0].id + 1 : 0,
      'PointStartId': start.id,
      'PointEndId': end.id,
      'path': [
        [start.x, start.y],
        [end.x, end.y],
      ]
    };
    setLines((current) => [...current, newLines]);
  }

  //Récupère l'icône en fonction du type du marker
  let getIcon = (marker) => {
    switch(marker.type) {
      case 'start':
        return createStartIcon(marker == currentMarker);
      case 'end':
        return createEndIcon(marker == currentMarker);
      case 'point':
        return createCheckpointIcon(marker == currentMarker);
    }
  }

  //Pour éditer les maps
  let mapEvent = useMapEvent({
    click: (event) => {
      if (inBounds(event)) {
        if (!markers.length > 0) {
          addMarker(event);
        } else {
          var newMarker = addMarker(event);
          addLine(startPoint, newMarker);
        }
      }
    },
    mousemove: (event) => {
      if (inBounds(event)) {
        setMousePosition({x: event.latlng.lat, y: event.latlng.lng});
      }
    }
  });

  return (
    <>
      {markers.length > 0 && markers[0][0] !== null
        ? markers.map((item, index) => {
            return (
              <Marker
                draggable={true}
                marker_index={index}
                key={index}
                position={[item.x, item.y]}
                icon={getIcon(item)}
                eventHandlers={{
                  click: () => {
                    {currentMarker ? (currentMarker.id == item.id ? setCurrentMarker(null) : setCurrentMarker(item)) : setCurrentMarker(item)}
                    if(editMode && item.type != 'start') {
                      setEditMode(false);
                      addLine(startPoint, item);
                      setStartPoint(item);
                    }
                  },
                  dragend: (event) => {
                    item.x = event.target._latlng.lat;
                    item.y = event.target._latlng.lng;
                    setLines((current) => current.filter(val => {
                      if(val.PointStartId == item.id) {
                        val.path[0] = [event.target._latlng.lat, event.target._latlng.lat];
                      }
                      if(val.PointEndId == item.id) {
                        val.path[1] = [event.target._latlng.lat, event.target._latlng.lat];
                      }
                      return val;
                    }));
                  }
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
