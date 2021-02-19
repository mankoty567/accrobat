import {
  Marker,
  useMapEvent
} from 'react-leaflet';
import {redIcon, blueIcon, greenIcon} from './MarkerIcons'

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 * @param {Object[]} editMode Est-ce qu'on est en train d'ajouter un segment à un point déjà existant
 * @param {Function} setEditMode Fonction pour update le state de editMode
 * @param {Object[]} lines La liste des lignes à afficher sur la map
 * @param {Function} setLines Fonction pour update le state de lines
 */
let DraggableMarkers = ({ markers, setMarkers, editMode, setEditMode, lines, setLines, currentMarker, setCurrentMarker, setStartPoint, startPoint }) => {

  //Ajoute un marker
  let addMarker = (event) => {
    var newMarker = {
      'id': markers.length > 0 ? markers.slice(-1)[0].id + 1 : 0,
      'title': '',
      'description': '',
      'type': markers.length > 0 ? 'point' : 'start',
      'x': event.latlng.lat,
      'y': event.latlng.lng
    };
    setMarkers((current) => [...current, newMarker]);
    setStartPoint(newMarker);
    return newMarker;
  };

  //Supprime un marker
  let removeMarker = (marker) => {
    setMarkers((current) => current.filter(val => val != marker));
    setLines((current) => current.filter(val => val.PointStartId != marker.id && val.PointEndId != marker.id));
    setStartPoint(markers.slice(-1)[0]);
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
        return greenIcon;
      case 'end':
        return redIcon;
      case 'point':
        return blueIcon;
      case 'default':
        return blueIcon;
    }
  }

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
                    setCurrentMarker(item);
                    // {currentMarker ? (currentMaker.id == item.id ? setCurrentMarker(null) : setCurrentMarker(item)) : setCurrentMarker(item)}
                    if(editMode && item.type != 'start') {
                      setEditMode(false);
                      addLine(startPoint, item);
                      setStartPoint(item);
                    }
                  }}}
              />
            );
          })
        : null}
    </>
  );
};

export default DraggableMarkers;
