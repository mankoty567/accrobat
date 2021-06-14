import React, { useEffect, useMemo, useState, useRef } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  useMapEvent,
  Marker,
  Tooltip,
} from 'react-leaflet';
import { Grid, Button, Modal } from '@material-ui/core';
import DraggableMarkers from './DraggableMarkers';
import useStyles from './MaterialUI';
import { API } from '../eventApi/api';
import ContextMenu from './ContextMenu';
import ModifyMarkerPopUp from './ModifyMarkerPopUp';
import ModifyObstaclePopUp from './ModifyObstaclePopUp';
import ErrorView from './ErrorView';
import ModifyChallenge from './ModifyChallenge';
import {
  createObstacleIcon,
  createLineAnchorIcon,
} from './MarkerIcons';

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

let ChallengeEditor = ({
  challenge_id,
  setSelected,
  open,
  setOpen,
}) => {
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
  const [modifyObstacle, setModifyObstacle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkMessage, setCheckMessage] = useState({});
  const [valid, setValid] = useState(false);
  const [challenge, setChallenge] = useState({
    id: '',
    title: '',
    description: '',
    echelle: 0,
  });
  const [errorMarkers, setErrorMarkers] = useState([]);
  const [selectedLine, setSelectedLine] = useState(null);
  const [currentObstacle, setCurrentObstacle] = useState(null);

  // Récupérer les valeurs x,y des obstacles
  function placeObstacle(pointTab, pourcentage) {
    pourcentage *= 100;
    let distanceArray = [];
    let sum = 0;

    for (let i = 0; i < pointTab.length - 1; i++) {
      let p1 = { x: pointTab[i][0], y: pointTab[i][1] };
      let p2 = { x: pointTab[i + 1][0], y: pointTab[i + 1][1] };

      let distance = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
      );

      distanceArray[i] = distance;
      sum = sum + distance;
    }

    let pourcentageArray = distanceArray.map((d) => (d * 100) / sum);

    let table = distanceArray.map((d, i) => ({
      distance: d,
      pourcentage: pourcentageArray[i],
    }));

    let segment = 0;

    let oldSum = 0;
    let totalSum = 0;
    let tableSum = table.map((t) => {
      oldSum = totalSum;
      totalSum = totalSum + t.pourcentage;
      return oldSum;
    });
    while (
      tableSum[segment + 1] < pourcentage &&
      segment < tableSum.length
    ) {
      segment = segment + 1;
    }

    let pourcentSomme = 0;

    for (let l = 0; l < segment; l++) {
      pourcentSomme = pourcentSomme + table[l].pourcentage;
    }

    let pourcentageInSegment = pourcentage - pourcentSomme;

    let obstaclePercent =
      (100 * pourcentageInSegment) / table[segment].pourcentage;

    let x =
      pointTab[segment][0] +
      (pointTab[segment + 1][0] - pointTab[segment][0]) *
        (obstaclePercent / 100);
    let y =
      pointTab[segment][1] +
      (pointTab[segment + 1][1] - pointTab[segment][1]) *
        (obstaclePercent / 100);

    return [x, y];
  }

  let Echelle = () => {
    var positions = [
      [0, 0],
      [1, 1],
    ];
    var text = null;
    if (challenge.echelle >= 2000) {
      positions = [
        [0.1, 0.1],
        [0.1, 1000 / challenge.echelle],
      ];
      text = '1000 mètres';
    } else {
      positions = [
        [0.1, 0.1],
        [0.1, 100 / challenge.echelle],
      ];
      text = '100 mètres';
    }
    const center = L.polygon(positions).getBounds().getCenter();
    return (
      <>
        <Marker
          position={positions[0]}
          icon={createLineAnchorIcon()}
        />
        <Polyline positions={positions} color={'black'}>
          <Tooltip direction="top">{text}</Tooltip>
        </Polyline>
        <Marker
          position={positions[1]}
          icon={createLineAnchorIcon()}
        />
      </>
    );
  };

  const initializeMap = async (challenge_id) => {
    await API.challenge
      .getChallenge({
        challenge_id,
        include: 'pointsegmentobstacle',
      })
      .then((res) => {
        setChallenge({
          id: challenge_id,
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
        let obstacles = [];
        res.PointPassages.forEach((pp) => {
          pp.pointStart.forEach((segment) => {
            newLines.push({
              id: segment.id,
              PointStartId: segment.PointStartId,
              PointEndId: segment.PointEndId,
              path: segment.path,
            });
            segment.Obstacles.forEach((obstacle) => {
              var startMarker = res.PointPassages.find(
                (m) => m.id === segment.PointStartId,
              );
              var endMarker = res.PointPassages.find(
                (m) => m.id === segment.PointEndId,
              );
              var positions = [
                [startMarker.y, startMarker.x],
                ...segment.path.map((elem) => {
                  return [elem[1], elem[0]];
                }),
                [endMarker.y, endMarker.x],
              ];
              var coords = placeObstacle(
                positions,
                obstacle.distance,
              );
              obstacles.push({
                id: obstacle.id,
                title: obstacle.title,
                description: obstacle.description,
                type: obstacle.type,
                distance: obstacle.distance,
                enigme_awnser: obstacle.enigme_awnser,
                SegmentId: obstacle.SegmentId,
                x: coords[1],
                y: coords[0],
              });
            });
          });
        });
        setObstacles(obstacles);
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
    API.challenge
      .updateChallenge({
        challenge: challenge,
      })
      .then((res) => {
        setChallenge({
          id: res.id,
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
    var coords = event.latlng;
    if (!inBounds(coords)) coords = fitInBounds(coords);
    try {
      var newMarker = {
        title: 'Point ' + markers.length,
        description: '',
        type: markers.length > 0 ? 'point' : 'start',
        x: coords.lng,
        y: coords.lat,
      };
      let data = await API.checkpoint.createMarker({
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
    var linesToUpdate = lines.filter(
      (val) =>
        val.PointStartId == marker.id || val.PointEndId == marker.id,
    );
    linesToUpdate.forEach((line) => {
      setObstacles((current) =>
        current.filter((val) => val.SegmentId != line.id),
      );
    });
    setLines((current) =>
      current.filter(
        (val) =>
          val.PointStartId != marker.id &&
          val.PointEndId != marker.id,
      ),
    );
    setStartPoint(markers.slice(-1)[0]);
    API.checkpoint.deleteMarker(marker.id).catch((err) => {
      console.log(err);
    });
    setValid(false);
  };

  //Update un marker
  let updateMarker = (marker) => {
    API.checkpoint.updateMarker(marker).catch((err) => {
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

  let getMarkerCoordsFromId = (id) => {
    var marker = markers.filter((current) => {
      if (current.id == id) return current;
    });
    return [marker[0].x, marker[0].y];
  };

  //Ajoute une ligne
  let addLine = (start, end) => {
    currentLine.shift();
    var newLine = {
      PointStartId: start.id,
      PointEndId: end.id,
      path: currentLine.map((p) => [p.lng, p.lat]),
      name: 'Segment ' + lines.length,
    };
    return API.segment
      .createSegment(newLine)
      .then((res) => {
        res.path = res.path.map((e) => [e[0], e[1]]);
        setLines((current) => [...current, res]);
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let addObstacle = async (event) => {
    var pointStart = getMarkerCoordsFromId(selectedLine.PointStartId);
    var pointEnd = getMarkerCoordsFromId(selectedLine.PointEndId);
    var positions = [
      [pointStart[1], pointStart[0]],
      ...selectedLine.path.map((elem) => {
        return [elem[1], elem[0]];
      }),
      [pointEnd[1], pointEnd[0]],
    ];
    try {
      var newObstacle = {
        title: 'Obstacle ' + obstacles.length,
        description: ' ',
        type: 'question',
        enigme_awnser: ' ',
        distance: 0.1,
        SegmentId: selectedLine.id,
      };
      let data = await API.obstacle.createObstacle(newObstacle);
      var coords = placeObstacle(positions, data.distance);
      data.x = coords[1];
      data.y = coords[0];
      setObstacles((current) => [...current, data]);
      setValid(false);
      setCurrentObstacle(data);
      setModifyObstacle(true);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  let updateObstacle = (obstacle) => {
    API.obstacle.updateObstacle(obstacle).catch((err) => {
      console.log(err);
    });
    setValid(false);
    var segment = lines.filter((current) => {
      if (current.id == obstacle.SegmentId) return current;
    });
    var pointStart = getMarkerCoordsFromId(segment[0].PointStartId);
    var pointEnd = getMarkerCoordsFromId(segment[0].PointEndId);
    var positions = [
      [pointStart[1], pointStart[0]],
      ...segment[0].path.map((elem) => {
        return [elem[1], elem[0]];
      }),
      [pointEnd[1], pointEnd[0]],
    ];
    var coords = placeObstacle(positions, obstacle.distance);
    obstacle.x = coords[1];
    obstacle.y = coords[0];
    setObstacles(
      obstacles.map((item) =>
        item.id == obstacle.id ? { ...item, obstacle } : item,
      ),
    );
  };

  let removeObstacle = (obstacle) => {
    setObstacles((current) =>
      current.filter((val) => val != obstacle),
    );
    API.obstacle.deleteObstacle(obstacle.id).catch((err) => {
      console.log(err);
    });
    setValid(false);
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
    event.originalEvent.preventDefault();
    setContextEvent({ event: event, type: type });
  };

  let handleContextEvent = async (event) => {
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
    if (event === 'updateObstacle') {
      setModifyObstacle(true);
    }
    if (event === 'deleteObstacle') {
      removeObstacle(currentObstacle);
    }
    setContextEvent(undefined);
  };

  let handleCheck = () => {
    updateChallenge(challenge);
    setErrorMarkers([]);
    API.challenge.checkValidity(challenge_id).then((data) => {
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
    API.challenge
      .publishChallenge(challenge_id)
      .then((data) => {
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   console.log(obstacles);
  //   console.log('update');
  // }, [obstacles]);
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
                crs={CRS.Simple}
                center={[bounds[1][0] / 2, bounds[1][1] / 2]}
                bounds={bounds}
                maxBounds={bounds}
                // zoom={9}
                // maxZoom={11}
                // minZoom={8}
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
                  removeMarker={removeMarker}
                  setCurrentObstacle={setCurrentObstacle}
                  setObstacles={setObstacles}
                  obstacles={obstacles}
                  updateObstacle={updateObstacle}
                  getMarkerCoordsFromId={getMarkerCoordsFromId}
                  placeObstacle={placeObstacle}
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
                      eventHandlers={{
                        click: () => {
                          var newCurrent = item;
                          if (currentObstacle) {
                            if (currentObstacle.id === item.id)
                              newCurrent = null;
                          }
                          setCurrentMarker(null);
                          setCurrentObstacle(newCurrent);
                        },
                        contextmenu: (event) => {
                          setCurrentObstacle(item);
                          event.originalEvent.view.L.DomEvent.stopPropagation(
                            event,
                          );
                          handleContext(event, 'obstacle');
                        },
                      }}
                      draggable={false}
                      key={item.id}
                      position={[item.y, item.x]}
                      icon={createObstacleIcon(
                        item.type == 'question',
                        item === currentObstacle,
                      )}
                    >
                      <Tooltip
                        direction="top"
                        offset={[0, -15]}
                        permanent
                      >
                        {item.title}
                      </Tooltip>
                    </Marker>
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
                <Echelle />
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
                <ModifyMarkerPopUp
                  modifyMarker={modifyMarker}
                  setModifyMarker={setModifyMarker}
                  setMarkers={setMarkers}
                  currentMarker={currentMarker}
                  markers={markers}
                  setStartPoint={setStartPoint}
                  updateMarker={updateMarker}
                />
              ) : null}
              {currentObstacle ? (
                <ModifyObstaclePopUp
                  modifyObstacle={modifyObstacle}
                  setModifyObstacle={setModifyObstacle}
                  setObstacles={setObstacles}
                  currentObstacle={currentObstacle}
                  updateObstacle={updateObstacle}
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
