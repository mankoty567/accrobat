import React, {
  useState
} from 'react';
import {
  CRS
} from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvent,
  Popup,
  Polyline
} from 'react-leaflet';
import {
  List,
  ListItem,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Button,
  TextField
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  makeStyles
} from '@material-ui/core/styles';

//Du style CSS de Material ui
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

/**
 * Permet de créer des markers au click et leurs lignes associées
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 */
const DraggableMarkers = ({
  markers,
  setMarkers,
  editMode,
  setEditMode,
  lines,
  setLines,
}) => {
  //Ajoute un marker
  let addMarker = (event) => {
    var newMarker = {
      'id': markers.length > 0 ? markers.slice(-1)[0].id + 1 : 0,
      'title': '',
      'description': '',
      'type': 'start',
      'x': event.latlng.lat,
      'y': event.latlng.lng
    };
    setMarkers((current) => [...current, newMarker]);
    return newMarker;
  };
  //Supprime un marker
  let removeMarker = (marker) => {
    setMarkers((current) => current.filter(val => val != marker));
    setLines((current) => current.filter(val => (val.PointStartId || val.PointEndId) != marker.id));
  }
  //Update un marker
  let updateMarker = (marker) => {
    setMarkers((current) => current.filter(val => {
      if (val.id == marker.id) val = marker;
      return val;
    }));
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
  //Pour éditer les maps
  const mapEvent = useMapEvent({
    click: (event) => {
      if (
        !(
          event.latlng.lat < 0 ||
          event.latlng.lat > 1 ||
          event.latlng.lng < 0 ||
          event.latlng.lng > 1
        )
      ) {
        if (!editMode) {
          addMarker(event);
        } else {
          var newMarker = addMarker(event);
          addLine(startPoint, newMarker);
          setEditMode(false);
        }
      }
    },
  });

  const [startPoint, setStartPoint] = useState(null);

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
                //icon={icon}
              >
                <Popup>
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
                    <ListItem>
                      <Select value={item.type} onChange={(e) => {
                          item.type = e.target.value;
                          updateMarker(item);
                        }}>
                        <MenuItem value={'start'}>Départ</MenuItem>
                        <MenuItem value={'end'}>Arrivée</MenuItem>
                        <MenuItem value={'point'}>Checkpoint</MenuItem>
                      </Select>
                    </ListItem>
                    <ListItem>
                      <IconButton onClick={() => {
                        setEditMode(true);
                        setStartPoint(item);
                      }}>
                        <AddIcon />
                      </IconButton>
                    </ListItem>
                  </List>
                  <Button variant='contained' color='secondary' onClick={() => removeMarker(item)}>
                    Supprimer
                  </Button>
                </Popup>
              </Marker>
            );
          })
        : null}
    </>
  );
};

const ChallengeEditor = () => {
  //Utilisation des classes CSS
  const classes = useStyles();

  //Informations sur la carte
  const bounds = [
    [0, 0],
    [1, 1],
  ];

  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' noWrap>
            Editeur de challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor='left'
      >
        <div className={classes.toolbar} />
        <List>
          <Typography variant='h5'>Menu d'édition</Typography>
          <Divider />
          <Button variant='contained' color='primary' onClick={() => {
            console.log(lines);
            console.log(markers);
          }}>
            Logs
          </Button>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MapContainer
          style={{ height: '90vh', width: '84vw' }}
          crs={CRS.Simple}
          center={[bounds[1][0] / 2, bounds[1][1] / 2]}
          bounds={bounds}
          maxBounds={bounds}
          style={{ height: '90vh', width: '84vw' }}
        >
          <ImageOverlay
            url={'/map.png'}
            bounds={bounds}
          ></ImageOverlay>
          <DraggableMarkers
            markers={markers}
            setMarkers={setMarkers}
            editMode={editMode}
            setEditMode={setEditMode}
            lines={lines}
            setLines={setLines}
          />
          {lines.map((element, index) => {
            return (
              <Polyline positions={element.path} key={index} color={'black'}></Polyline>
            );
          })}
        </MapContainer>
      </main>
    </div>
  );
};

export default ChallengeEditor;
