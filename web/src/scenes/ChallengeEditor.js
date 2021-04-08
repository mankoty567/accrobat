import React, { useEffect, useMemo, useState } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  useMapEvent,
} from 'react-leaflet';
import {
  List,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  Button,
  Modal,
} from '@material-ui/core';
import DraggableMarkers from './DraggableMarkers';
import useStyles from './MaterialUI';
import MarkerEditor from './MarkerEditor';
import ChallengeInfosEditor from './ChallengeInfosEditor';
import ObstacleEditor from './ObstacleEditor';
import API from '../eventApi/eventApi';
import { useHistory } from 'react-router';

let inBounds = (event) => {
  return !(
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

let NewPolyline = ({ from }) => {
  // let mousePosition = useMousePosition();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  let map = useMapEvent(
    useMemo(
      () => ({
        mousemove: (event) => {
          if (inBounds(event)) {
            setMousePosition({
              x: event.latlng.lat,
              y: event.latlng.lng,
            });
          }
        },
      }),
      [],
    ),
  );
  if (from.length == 0) return <></>;
  var positions = [
    from[from.length - 1],
    [mousePosition.x, mousePosition.y],
  ];
  return (
    <Polyline positions={positions} color={'black'} dashArray={5} />
  );
};

let ChallengeEditor = ({ challenge_id }) => {
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
  const [currentLine, setCurrentLine] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(true);

  const initializeMap = async (challenge_id) => {
    await API.getChallenge({
      challenge_id,
      include: 'pointsegmentobstacle',
    })
      .then((res) => {
        res.PointPassages.forEach((element) => {
          setMarkers((current) => [
            ...current,
            {
              id: element.id,
              title: element.title,
              description: element.description,
              type: element.type,
              x: element.x,
              y: element.y,
            },
          ]);
        });
        let newLines = [];
        res.PointPassages.forEach((pp) => {
          pp.pointStart.forEach((segment) => {
            newLines.push({
              id: segment.id,
              PointStartId: segment.PointStartId,
              PointEndId: segment.PointEndId,
              path: segment.path,
            });
          });
        });
        setLines(newLines);
      })
      .then(() => {
        setIsLoading(true);
      });
  };

  useEffect(() => initializeMap(challenge_id), []);
  let history = useHistory();

  const [checkMessage, setCheckMessage] = useState({});

  function handleCheck() {
    API.checkValidity(challenge_id).then(data => {
      console.log(data);
      if (data.valid) {
        setCheckMessage({valid: true, message: "Le challenge est valide!"});
      } else {
        let obj = {valid: false, message: "Le challenge n'est pas valide parceque :"}

        data.error.forEach(e => {
          if (e === "not_1_start") obj.message = obj.message + "Il n'y a pas de départ, ";
          if (e === "not_1_end") obj.message = obj.message + "Il n'y a pas d'arrivée, ";
          if (e.startsWith("point_impasse")) obj.message = obj.message + "Un point est une impasse : " + e.replace("point_impasse:", "") + ", ";
          if (e.startsWith("point_inaccessible")) obj.message = obj.message + "Un point est inaccessible : " + e.replace("point_inaccessible:", "") + ", ";
          if (e.startsWith("arrive_inaccessible")) obj.message = obj.message + "Un point ne peut pas arriver à l'Arrivée : " + e.replace("arrive_inaccessible:", "") + ", ";
        })

        setCheckMessage(obj);
      }
    })
  }

  return (
    <div className={classes.root}>
      <Modal open={open}>
        {isLoading ? (
          <>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <Typography variant="h6" noWrap style={{ flex: 1 }}>
                  Éditeur de challenge
                </Typography>
                <Button
                  className={classes.back_button}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Retour
                </Button>
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{ paper: classes.drawerPaper }}
              anchor="left"
            >
              <div className={classes.toolbar} />
              <List>
                <Typography variant="h5">Menu d'édition</Typography>
                <Divider />
                <Typography
                  variant="h6"
                  className={classes.margin_top}
                >
                  Édition du challenge
                </Typography>
                <Divider />
                <ChallengeInfosEditor />
                <Typography
                  variant="h6"
                  className={classes.margin_top}
                >
                  Édition d'un point
                </Typography>
                <Divider />
                {currentMarker ? (
                  <MarkerEditor
                    marker={currentMarker}
                    setStartPoint={setStartPoint}
                    setEditMode={setEditMode}
                    setMarkers={setMarkers}
                    markers={markers}
                    setLines={setLines}
                  />
                ) : (
                  <Typography
                    variant="h6"
                    className={classes.margin_top}
                  >
                    Sélectionner un point à modifier
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    console.log(lines);
                    console.log(markers);
                  }}
                >
                  Logs
                </Button>
                <Divider />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheck}
                >
                  Vérifier
                </Button>
                <br/>
                <p style={{color: checkMessage.valid ? "green": "red"}}>{checkMessage.message}</p>
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
                  url={`https://api.acrobat.bigaston.dev/api/challenge/${challenge_id}/image`}
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
                  setCurrentLine={setCurrentLine}
                  currentLine={currentLine}
                  currentMarker={currentMarker}
                  setStartPoint={setStartPoint}
                  startPoint={startPoint}
                  CHALLENGE_ID={challenge_id}
                />
                {lines.map((element) => {
                  try {
                    const startMarker = markers.find(
                      (m) => m.id === element.PointStartId,
                    );
                    const endMarker = markers.find(
                      (m) => m.id === element.PointEndId,
                    );

                    const positions = [
                      [startMarker.y, startMarker.x],
                      ...element.path.map((elem) => {
                        return [elem[1], elem[0]];
                      }),
                      [endMarker.y, endMarker.x],
                    ];
                    console.log(positions);
                    return (
                      <Polyline
                        positions={positions}
                        key={element.id}
                        color={'black'}
                      />
                    );
                  } catch (err) {
                    console.error(err);
                  }
                })}
                {currentMarker ? (
                  <>
                    <Polyline
                      positions={[
                        [currentMarker.y, currentMarker.x],
                        ...currentLine,
                      ]}
                      color={'black'}
                    />
                    {currentMarker.type != 'end' ? (
                      <NewPolyline from={currentLine} />
                    ) : null}
                  </>
                ) : null}
              </MapContainer>
            </main>
          </>
        ) : (
          <p>Chargement en cours ...</p>
        )}
      </Modal>
    </div>
  );
};

export default ChallengeEditor;
