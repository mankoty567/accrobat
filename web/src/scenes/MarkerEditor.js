import {
  List,
  ListItem,
  IconButton,
  Select,
  MenuItem,
  Button,
  TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

let MarkerEditor = ({item, setStartPoint, setEditMode, markers, setMarkers}) => {

  //Update un marker
  let updateMarker = (marker) => {
    console.log(markers);
    setMarkers((current) => current.filter(val => {
      if (val.id == marker.id) val = marker;
      return val;
    }));
  }

  return (
    <>
      <List>
        <ListItem>
          <TextField value={item.title} label='Titre' 
            onChange={(e) => {
              item.title = e.target.value;
              updateMarker(item);
            }} />
        </ListItem>
        <ListItem>
          <TextField value={item.description} label='Description' 
            onChange={(e) => {
              item.description = e.target.value;
              updateMarker(item);
            }} />
        </ListItem>
        {item.type != 'start' ? 
          <ListItem>
            <Select value={item.type} onChange={(e) => {
              item.type = e.target.value;
              updateMarker(item);
              if(item.type == 'end') {
                setStartPoint(markers.slice(-2)[0]);                            
              }
            }}>
              <MenuItem value={'start'}>Départ</MenuItem>
              <MenuItem value={'end'}>Arrivée</MenuItem>
              <MenuItem value={'point'}>Checkpoint</MenuItem>
            </Select>
          </ListItem> 
        : null}
        {item.type != 'end' ? 
        <ListItem>
          <Button variant='contained' color='primary' onClick={() => {
            setEditMode(true);
            setStartPoint(item);
          }}>
            Relier un autre segment
          </Button>
        </ListItem>
        : null}
      </List>
      <Button variant='contained' color='secondary' onClick={() => removeMarker(item)}>
        Supprimer
      </Button>
    </>
  );
}

export default MarkerEditor;