import React, { useState, useEffect } from 'react';
import { bounds, CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvent,
  Popup,
  useMap,
  Polyline,
} from 'react-leaflet';
import {
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  IconButton,
  Select,
  MenuItem,
  Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';

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

// var greenIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// var redIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// var blueIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

/**
 * Permet de créer des markers au click
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 */
const DraggableMarkers = ({
  markers,
  setMarkers,
  editMode,
  setEditMode,
  setLines,
}) => {
  //Fonction pour ajouter un marker
  let addMarker = (event) => {
    setMarkers((current) => [...current, event.latlng]);
  };
  //Supprimer un marker
  let removeMarker = (marker) => {
    setMarkers((current) => current.filter(val => val != marker));
  }
  //Fonction pour ajouter une ligne
  let addLine = (start, end) => {
    setLines((current) => [...current, [start, end]]);
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
          console.log(event.latlng);
          addLine(startPoint, event.latlng);
          addMarker(event);
          setEditMode(false);
        }
      }
    },
  });

  const [startPoint, setStartPoint] = useState(null);
  // const [type, setType] = useState('Begin');
  // const [icon, setIcon] = useState(blueIcon);

  // useEffect(() => {
  //   switch(type) {
  //     case 'Begin':
  //       setIcon(blueIcon);
  //       return;
  //     case 'End':
  //       setIcon(redIcon);
  //       return;
  //     case 'Checkpoint':
  //       setIcon(greenIcon);
  //       return;
  //     default:
  //       return;
  //   }
  // }, [type]);

  const map = useMap();

  return (
    <>
      {markers.length > 0 && markers[0][0] !== null
        ? markers.map((item, index) => {
            return (
              <Marker
                draggable={false}
                marker_index={index}
                key={index}
                position={item}
                //icon={icon}
              >
                <Popup>
                  <List>
                    <ListItem>
                      <IconButton onClick={() => {
                        setEditMode(true);
                        setStartPoint(item);
                      }}>
                        <AddIcon />
                      </IconButton>
                    </ListItem>
                    <ListItem>
                      <Select /*onChange={(e) => setType(e.target.value)}*/>
                        <MenuItem value={'Begin'}>Départ</MenuItem>
                        <MenuItem value={'End'}>Arrivée</MenuItem>
                        <MenuItem value={'Checkpoint'}>
                          Point de passage
                        </MenuItem>
                      </Select>
                    </ListItem>
                  </List>
                  <Button variant="contained" color="secondary" onClick={() => removeMarker(item)}>
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
  //Retient la position de la ligne sélectionnée
  const currentLine = useState(null);
  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [editMode, setEditMode] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Editeur de challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <List>
          <Typography variant="h5">Menu d'édition</Typography>
          <Divider />
          {['Test 1', 'Test 2', 'Test 3'].map((text, index) => {
            return (
              <ListItem button key={index}>
                <ListItemText primary={text}></ListItemText>
              </ListItem>
            );
          })}
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
            setLines={setLines}
          />
          {lines.map((element, index) => {
            return (
              <Polyline positions={element} key={index} color={'black'}></Polyline>
            );
          })}
        </MapContainer>
      </main>
    </div>
  );
};

export default ChallengeEditor;
