import React, { useEffect, useMemo, useState, useRef } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  useMapEvent,
} from 'react-leaflet';
import { Grid, Button, Modal } from '@material-ui/core';
import DraggableMarkers from './DraggableMarkers';
import useStyles from './MaterialUI';
import API from '../eventApi/eventApi';
import ContextMenu from './ContextMenu';
import ModifyPopUp from './ModifyPopUp';
import ErrorView from './ErrorView';
import ModifyChallenge from './ModifyChallenge';
import { createObstacleIcon } from './MarkerIcons';

let inBounds = (event) => {
  return !(
    event.latlng.lat < 0 ||
    event.latlng.lat > 1 ||
    event.latlng.lng < 0 ||
    event.latlng.lng > 1
  );
};

let NewPolyline = ({ from }) => {
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

let ChallengeEditor = ({ challenge_id, setSelected }) => {
  //Utilisation des classes CSS
  const classes = useStyles();

  //Informations sur la carte
  const bounds = [
    [0, 0],
    [1, 1],
  ];

  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [currentLine, setCurrentLine] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [contextMenu, setContextEvent] = useState(undefined);
  const contextRef = useRef(undefined);
  const [addingLine, setAddingLine] = useState(false);
  const [modifyMarker, setModifyMarker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [checkMessage, setCheckMessage] = useState({});
  const [valid, setValid] = useState(false);
  const [challenge, setChallenge] = useState({
    title: '',
    description: '',
    echelle: 0,
  });
  const [errorMarkers, setErrorMarkers] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);

  const initializeMap = async (challenge_id) => {
    await API.getChallenge({
      challenge_id,
      include: 'pointsegmentobstacle',
    })
      .then((res) => {
        setChallenge({
          title: res.title,
          description: res.description,
          echelle: res.echelle,
        });
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

  let inBounds = (coords) => {
    return !(
      coords.lat < 0 ||
      coords.lat > 1 ||
      coords.lng < 0 ||
      coords.lng > 1
    );
  };

  let fitInBounds = (coords) => {
    if (coords.lat < 0) coords.lat = 0;
    if (coords.lat > 1) coords.lat = 1;
    if (coords.lng < 0) coords.lng = 0;
    if (coords.lng > 1) coords.lng = 1;
    return coords;
  };

  let updateChallenge = async (challenge) => {
    API.updateChallenge({
      challenge_id: challenge_id,
      challenge: challenge,
    })
      .then((res) => {
        setChallenge({
          title: res.title,
          description: res.description,
          echelle: res.echelle,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Ajoute un marker
  let addMarker = async (event) => {
    try {
      var newMarker = {
        title: 'Point ' + markers.length,
        description: '',
        type: markers.length > 0 ? 'point' : 'start',
        x: event.latlng.lng,
        y: event.latlng.lat,
      };
      let data = await API.createMarker({
        marker: newMarker,
        challenge_id: challenge_id,
      });
      setMarkers((current) => [...current, data]);
      setStartPoint(data);
      setCurrentMarker(data);
      setValid(false);
      return data;
    } catch (err) {
      console.log(err);
    }
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
    setStartPoint(markers.slice(-1)[0]);
    API.deleteMarker(marker).catch((err) => {
      console.log(err);
    });
    setValid(false);
  };

  //Update un marker
  let updateMarker = (marker) => {
    API.updateMarker({ marker }).catch((err) => {
      console.log(err);
    });
    setValid(false);
    setMarkers((current) =>
      current.filter((val) => {
        if (val.id == marker.id) val = marker;
        return val;
      }),
    );
  };

  //Ajoute une ligne
  let addLine = (start, end) => {
    currentLine.shift();
    var newLines = {
      PointStartId: start.id,
      PointEndId: end.id,
      path: currentLine.map((p) => [p.lat, p.lng]),
      name: 'Segment ' + lines.length,
    };
    return API.createSegment({ segment: newLines })
      .then((res) => {
        res.path = res.path.map((e) => [e[0], e[1]]);
        setLines((current) => [...current, res]);
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let addObstacle = (event) => {
    // var newObstacle = {
    //   title: 'Point ' + markers.length,
    //   description: '',
    //   type: markers.length > 0 ? 'point' : 'start',
    //   x: event.latlng.lng,
    //   y: event.latlng.lat,
    // };
  };

  let addCurrentLine = (newPoint) => {
    var coords = newPoint.latlng;
    if (!inBounds(coords)) {
      coords = fitInBounds(coords);
    }
    if (currentLine == []) {
      setCurrentLine([coords]);
    } else {
      setCurrentLine((current) => [...current, coords]);
    }
  };

  let handleContext = (event, type) => {
    // console.log(type);
    event.originalEvent.preventDefault();
    setContextEvent({ event: event, type: type });
  };

  let handleContextEvent = async (event) => {
    // console.log(event);
    if (event === 'addMarker') {
      addMarker(contextMenu.event);
      if (addingLine) {
        setAddingLine(false);
      }
    }
    if (event === 'addLine') {
      setAddingLine(true);
      addCurrentLine(contextMenu.event);
    }
    if (event === 'addMarkerJoined') {
      var newMarker = await addMarker(contextMenu.event);
      addCurrentLine(contextMenu.event);
      addLine(currentMarker, newMarker);
      setAddingLine(false);
      setCurrentLine([]);
    }
    if (event === 'updateMarker') {
      setModifyMarker(true);
    }
    if (event === 'deleteMarker') {
      removeMarker(currentMarker);
    }
    if (event === 'addObstacle') {
      addObstacle(contextMenu.event);
    }
    setContextEvent(undefined);
  };

  let handleCheck = () => {
    updateChallenge(challenge);
    setErrorMarkers([]);
    API.checkValidity(challenge_id).then((data) => {
      setValid(data.valid);
      if (data.valid) {
        setCheckMessage({
          valid: true,
          message: ['Le challenge est valide !'],
        });
      } else {
        let obj = {
          valid: false,
          message: [],
        };

        data.error.forEach((e) => {
          var marker = markers.filter((val) => {
            if (val.id == e.match(/(\d+)/)[0]) return val;
          })[0];
          if (e === 'not_1_start')
            obj.message.push("- Il n'y a pas de départ");
          if (e === 'not_1_end')
            obj.message.push("- Il n'y a pas d'arrivée");
          if (e.startsWith('point_impasse'))
            obj.message.push(`- ${marker.title} est une impasse`);
          if (e.startsWith('point_inaccessible'))
            obj.message.push(`- ${marker.title} est inaccessible`);
          if (e.startsWith('arrive_inaccessible'))
            obj.message.push(
              `- ${marker.title} n'atteint pas l'arrivée`,
            );
          if (marker != undefined)
            setErrorMarkers((current) => [...current, marker]);
        });
        setCheckMessage(obj);
      }
    });
  };

  let handlePublish = () => {
    API.publishChallenge(challenge_id)
      .then((data) => {
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => initializeMap(challenge_id), []);
  useEffect(() => {
    if (!valid) {
      setCheckMessage({});
    }
  }, [valid]);

  return (
    <div className={classes.root}>
      <Modal
        aria-labelledby="title"
        aria-describedby="content"
        open={open}
      >
        {isLoading ? (
          <>
            <ContextMenu
              data={contextMenu}
              onEvent={handleContextEvent}
            />
            <main id="content" className={classes.content}>
              <Grid
                id="title"
                style={{
                  marginTop: 0,
                  marginBottom: 10,
                  display: 'flex',
                }}
                container
                justify="space-between"
              >
                <h2 style={{ margin: 0 }}>
                  Édition de {challenge.title}
                </h2>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelected(null);
                    setOpen(false);
                  }}
                >
                  X
                </Button>
              </Grid>
              <ModifyChallenge
                challenge={challenge}
                setChallenge={setChallenge}
              />
              <MapContainer
                className={classes.mapContainer}
                // style={{ height: '85vh', width: '84vw' }}
                crs={CRS.Simple}
                center={[bounds[1][0] / 2, bounds[1][1] / 2]}
                bounds={bounds}
                maxBounds={bounds}
                zoom={9}
              >
                <ImageOverlay
                  url={`https://api.acrobat.bigaston.dev/api/challenge/${challenge_id}/image`}
                  bounds={bounds}
                ></ImageOverlay>
                <DraggableMarkers
                  addingLine={addingLine}
                  addCurrentLine={addCurrentLine}
                  setAddingLine={setAddingLine}
                  markers={markers}
                  handleContext={handleContext}
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
                  setCurrentLine={setCurrentLine}
                  setContextEvent={setContextEvent}
                  contextRef={contextRef}
                  addLine={addLine}
                  setAddingLine={setAddingLine}
                  setCurrentLine={setCurrentLine}
                  setValid={setValid}
                  errorMarkers={errorMarkers}
                  inBounds={inBounds}
                  fitInBounds={fitInBounds}
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
                    return (
                      <Polyline
                        eventHandlers={{
                          contextmenu: (event) => {
                            setSelectedLine(element);
                            event.originalEvent.view.L.DomEvent.stopPropagation(
                              event,
                            );
                            handleContext(event, 'line');
                          },
                        }}
                        positions={positions}
                        key={element.id}
                        color={'black'}
                      />
                    );
                  } catch (err) {
                    console.error(err);
                  }
                })}
                {obstacles.map((item) => {
                  return (
                    <Marker
                      draggable={true}
                      marker_index={item.id}
                      key={item.id}
                      position={[item.y, item.x]}
                      icon={createObstacleIcon()}
                    ></Marker>
                  );
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
              <Grid container justify="center">
                <div className={classes.actionButtons}>
                  {valid ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePublish}
                      >
                        Publier
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheck}
                      >
                        Vérifier / Mettre à jour
                      </Button>
                    </>
                  )}
                </div>
              </Grid>

              {currentMarker ? (
                <ModifyPopUp
                  modifyMarker={modifyMarker}
                  setModifyMarker={setModifyMarker}
                  setMarkers={setMarkers}
                  currentMarker={currentMarker}
                  markers={markers}
                  setStartPoint={setStartPoint}
                  updateMarker={updateMarker}
                />
              ) : null}
            </main>
            {Object.keys(checkMessage).length === 0 ? null : (
              <>
                {!valid ? (
                  <ErrorView
                    checkMessage={checkMessage}
                    setCheckMessage={setCheckMessage}
                  />
                ) : null}
              </>
            )}
          </>
        ) : (
          <p>Chargement en cours ...</p>
        )}
      </Modal>
    </div>
  );
};

export default ChallengeEditor;
