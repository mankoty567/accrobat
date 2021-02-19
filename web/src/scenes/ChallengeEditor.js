import React, {
  useState
} from 'react';
import {
  CRS
} from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline
} from 'react-leaflet';
import {
  List,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  Button,
} from '@material-ui/core';
import DraggableMarkers from './DraggableMarkers'
import useStyles from './MaterialUI'
import MarkerEditor from './MarkerEditor';

let ChallengeEditor = () => {

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
  const [currentMarker, setCurrentMarker] = useState(null);
  const [startPoint, setStartPoint] = useState(null);

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
        classes={{ paper: classes.drawerPaper }}
        anchor='left'
      >
        <div className={classes.toolbar} />
        <List>
          <Typography variant='h5'>Menu d'édition</Typography>
          <Divider />
          {currentMarker ? 
          <MarkerEditor 
            marker={currentMarker}
            setStartPoint={setStartPoint}
            setEditMode={setEditMode}
            setMarkers={setMarkers}
            markers={markers}
            setLines={setLines}
          />
          : "Sélectionner un marker à modifier"}
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
            setCurrentMarker={setCurrentMarker}
            currentMarker={currentMarker}
            setStartPoint={setStartPoint}
            startPoint={startPoint}
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
