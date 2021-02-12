import React, { useState } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Marker,
  useMapEvent,
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
} from '@material-ui/core';
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

/**
 * Permet de créer des markers au click
 * @param {Object[]} markers La liste des markers à afficher sur la map
 * @param {Function} setMarkers Fonction pour update le state de markers
 */
const DraggableMarkers = ({ markers, setMarkers }) => {
  //Fonction pour ajouter un marker
  let addMarker = (event) => {
    setMarkers((current) => [...current, event.latlng]);
  };
  //Pour éditer les maps
  const map = useMapEvent({
    click: (event) => {
      addMarker(event);
    },
  });

  return (
    <>
      {markers.map((item, index) => {
        return (
          <Marker
            draggable={true}
            marker_index={index}
            key={index}
            position={item}
          />
        );
      })}
    </>
  );
};

const ChallengeEditor = () => {
  //Utilisation des classes CSS
  const classes = useStyles();

  //Informations sur la carte
  const bounds = [
    [0, 0],
    [1750, 2450],
  ];
  const [markers, setMarkers] = useState([[1000, 1000]]);

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
          {['Depart', 'Arrivée', 'Point de passage', 'Obstacle'].map(
            (text) => {
              return (
                <>
                  <ListItem button key={text}>
                    <ListItemText primary={text}></ListItemText>
                  </ListItem>
                </>
              );
            },
          )}
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
          zoom={0}
          maxZoom={4}
        >
          <ImageOverlay
            url={'/map.png'}
            bounds={bounds}
          ></ImageOverlay>
          <DraggableMarkers
            markers={markers}
            setMarkers={setMarkers}
          />
        </MapContainer>
      </main>
    </div>
  );
};

export default ChallengeEditor;
