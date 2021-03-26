import React, {
  useMemo,
  useState
} from 'react';
import {
  CRS
} from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  useMapEvent
} from 'react-leaflet';
import {
  List,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  Button
} from '@material-ui/core';
import DraggableMarkers from './DraggableMarkers'
import useStyles from './MaterialUI'
import MarkerEditor from './MarkerEditor';
import ChallengeInfosEditor from './ChallengeInfosEditor';


let inBounds = (event) => {
  return!(
    event.latlng.lat < 0 ||
    event.latlng.lat > 1 ||
    event.latlng.lng < 0 ||
    event.latlng.lng > 1
  );
};

// let useMousePosition = () => {
//   const [mousePosition, setMousePosition] = useState({x:null, y:null});

//   useEffect(() => {
//     const f = (e) => { setMousePosition(e.cursor.x) };
//     window.addEventListener('mousemove', f);
//     return () => window.removeEventListener('mousemove', f);
//   }, []);

//   return mousePosition;
// };

let NewPolyline = ({from}) => {
  // let mousePosition = useMousePosition();
  const [mousePosition, setMousePosition] = useState({x:0, y:0});

  let map = useMapEvent(useMemo(() => ({
    mousemove: (event) => {
      if (inBounds(event)) {
        setMousePosition({x: event.latlng.lat, y: event.latlng.lng});
      }
    }
  }), []));

  return <Polyline positions={[[from.y, from.x], [mousePosition.x, mousePosition.y]]} color={'black'} dashArray={5} />
}

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
            Éditeur de challenge
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
          <Typography variant='h6' className={classes.margin_top}>Édition du challenge</Typography>
          <Divider />
          <ChallengeInfosEditor />
          <Typography variant='h6' className={classes.margin_top}>Édition d'un point</Typography>
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
          : <Typography variant='h6' className={classes.margin_top}>Sélectionner un point à modifier</Typography>}
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
          {editMode ? 
          <>
            <NewPolyline from={currentMarker} />
          </>
          : null}
          {lines.map((element) => {
            const startMarker = markers.find(m => m.id === element.PointStartId);
            const endMarker = markers.find(m => m.id === element.PointEndId);
            const positions = [
              [ startMarker.y, startMarker.x ],
              ...element.path,
              [ endMarker.y, endMarker.x ],
            ];
            return (
              <Polyline positions={positions} key={element.id} color={'black'} />
            );
          })}
        </MapContainer>
      </main>
    </div>
  );
};

export default ChallengeEditor;
