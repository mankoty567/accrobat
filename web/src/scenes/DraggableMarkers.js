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
let DraggableMarkers = ({ markers, setMarkers, editMode, setEditMode, lines, setLines, currentMarker, setCurrentMarker, setStartPoint, currentLine, setCurrentLine}) => {

  //Ajoute un marker
  let addMarker = (event) => {
    var id = markers.length > 0 ? markers.slice(-1)[0].id + 1 : 0;
    var newMarker = {
      'id': id,
      'title': 'Point ' + id,
      'description': '',
      'type': markers.length > 0 ? 'point' : 'start',
      'x': event.latlng.lng,
      'y': event.latlng.lat
    };
    setMarkers((current) => [...current, newMarker]);
    setStartPoint(newMarker);
    setCurrentMarker(newMarker);
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
      'path': currentLine
    };
    setLines((current) => [...current, newLines]);
  }

  let addCurrentLine = (newPoint) => {
    if (currentLine == []) {
      setCurrentLine([newPoint.latlng]);
    } else {
      setCurrentLine((current) => [...current, newPoint.latlng]);
    }
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
  let map = useMapEvent({
    click: (event) => {
      if (inBounds(event)) {
        if (!markers.length > 0) {
          addMarker(event);
        } else {
          if (event.originalEvent.ctrlKey) {
            addCurrentLine(event);
          } else {
            var newMarker = addMarker(event);
            addLine(currentMarker, newMarker);
            setCurrentLine([event.latlng]);
          }
        }
      }
    },
    // mousemove: (event) => {
    //   if (inBounds(event)) {
    //     setMousePosition({x: event.latlng.lat, y: event.latlng.lng});
    //   }
    // }
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
                    // {currentMarker ? (currentMarker.id === item.id ? (editMode ? null : setCurrentMarker(null)) : setCurrentMarker(item)) : setCurrentMarker(item)}
                    var newCurrent = item;
                    if (currentMarker) {
                      if (currentMarker.id === item.id && editMode) newCurrent = null;
                    }
                    setCurrentMarker(newCurrent);
                    if(editMode && item.type != 'start' && currentMarker.id != item.id) {
                      setEditMode(false);
                      addLine(currentMarker, item);
                      // setStartPoint(item);
                    }
                  },
                  dragend: (event) => {
                    setMarkers(markers => markers.map(m => m.id === item.id ? { ...m, x: event.target._latlng.lng, y: event.target._latlng.lat } : m));
                    setEditMode(false);
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
