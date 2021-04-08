import {
  List,
  ListItem,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import API from '../eventApi/eventApi';

let MarkerEditor = ({
  marker,
  setStartPoint,
  setEditMode,
  markers,
  setMarkers,
  setLines,
  setCurrentLine
}) => {
  //Update un marker
  let updateMarker = (marker) => {
    API.updateMarker({marker}).catch(err => {
      console.log(err);
    })

    setMarkers((current) =>
      current.filter((val) => {
        if (val.id == marker.id) val = marker;
        return val;
      }),
    );
  };

  //Supprime un marker
  let removeMarker = (marker) => {
    setMarkers((current) => current.filter((val) => val != marker));
    setLines((current) =>
      current.filter(
        (val) =>
          val.PointStartId != marker.id &&
          val.PointEndId != marker.id,
      ),
    );
    var newCurrent = markers.slice(-1)[0];
    if (newCurrent.type !== "end") {
      setCurrentLine([{
        lng: newCurrent.x,
        lat: newCurrent.y
      }]);
    } else {
      setCurrentLine([]);
    }
    setStartPoint(newCurrent);
    
    API.deleteMarker(marker).catch(err => {
      console.log(err)
    })
  };

  return (
    <>
      <List>
        <ListItem>
          <TextField
            value={marker.title}
            label="Titre"
            onChange={(e) => {
              marker.title = e.target.value;
              updateMarker(marker);
            }}
          />
        </ListItem>
        <ListItem>
          <TextField
            value={marker.description}
            label="Description"
            onChange={(e) => {
              marker.description = e.target.value;
              updateMarker(marker);
            }}
          />
        </ListItem>
        {marker.type != 'start' ? (
          <ListItem>
            <InputLabel shrink id="select-label">
              Type
            </InputLabel>
            <Select
              labelId="select-label"
              value={marker.type}
              onChange={(e) => {
                marker.type = e.target.value;
                updateMarker(marker);
                if (marker.type == 'end') {
                  setStartPoint(markers.slice(-2)[0]);
                }
              }}
            >
              <MenuItem value={'end'}>Arrivée</MenuItem>
              <MenuItem value={'point'}>Checkpoint</MenuItem>
            </Select>
          </ListItem>
        ) : null}
        {marker.type != 'end' ? (
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditMode(true);
                setStartPoint(marker);
              }}
            >
              Lier à un autre checkpoint
            </Button>
          </ListItem>
        ) : null}
        <ListItem>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => removeMarker(marker)}
          >
            Supprimer le point sélectionné
          </Button>
        </ListItem>
      </List>
    </>
  );
};

export default MarkerEditor;
