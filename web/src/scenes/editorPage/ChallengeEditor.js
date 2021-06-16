import React, { useEffect, useState, useRef } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  Marker,
  Tooltip,
} from 'react-leaflet';
import { Grid, Button, Modal } from '@material-ui/core';
import Markers from './Markers';
import Lines from './Lines';
import PreviewLine from './PreviewLine';
import Obstacles from './Obstacles';
import ContextMenu from './ContextMenu';
import ErrorView from './ErrorView';
import ModifyChallenge from './modifyElements/ModifyChallenge';
import ModifyMarkerPopUp from './modifyElements/ModifyMarkerPopUp';
import ModifyObstaclePopUp from './modifyElements/ModifyObstaclePopUp';
import ModifyLinePopUp from './modifyElements/ModifyLinePopUp';
import { API } from '../../eventApi/api';
import useStyles from '../../components/MaterialUI';
import { createLineAnchorIcon } from '../../components/MarkerIcons';
import { inBounds, fitInBounds } from '../../components/Bounds';
import placeOnSegment from '../../components/PlaceOnSegments';

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
  const [previewLine, setPreviewLine] = useState([]);
  const [contextMenu, setContextEvent] = useState(undefined);
  const contextRef = useRef(undefined);
  const [addingLine, setAddingLine] = useState(false);
  const [modifyMarker, setModifyMarker] = useState(false);
  const [modifyObstacle, setModifyObstacle] = useState(false);
  const [modifyLine, setModifyLine] = useState(false);
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
  const [waitingAPI, setWaitingAPI] = useState(false);

  let Echelle = () => {
    var positions = [
      [0, 0],
      [1, 1],
    ];
    var text = null;
    if (challenge.echelle >= 15000) {
      positions = [
        [0.1, 0.1],
        [0.1, 10000 / challenge.echelle],
      ];
      text = '10000 mètres';
    } else if (challenge.echelle >= 1500) {
      positions = [
        [0.1, 0.1],
        [0.1, 1000 / challenge.echelle],
      ];
      text = '1000 mètres';
    } else if (challenge.echelle >= 150) {
      positions = [
        [0.1, 0.1],
        [0.1, 100 / challenge.echelle],
      ];
      text = '100 mètres';
    } else {
      positions = [
        [0.1, 0.1],
        [0.1, 10 / challenge.echelle],
      ];
      text = '10 mètres';
    }
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
              name: segment.name,
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
              var coords = placeOnSegment(
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
        setIsLoading(false);
      });
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
    var newMarker = {
      title: 'Point ' + markers.length,
      description: '',
      type: markers.length > 0 ? 'point' : 'start',
      x: coords.lng,
      y: coords.lat,
    };
    return API.checkpoint
      .createMarker({
        marker: newMarker,
        challenge_id: challenge_id,
      })
      .then((res) => {
        setMarkers((current) => [...current, res]);
        setCurrentMarker(res);
        setValid(false);
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Supprime un marker
  let removeMarker = (marker) => {
    setWaitingAPI(true);
    API.checkpoint
      .deleteMarker(marker.id)
      .then(() => {
        setMarkers((current) =>
          current.filter((val) => val != marker),
        );
        setPreviewLine([]);
        lines
          .filter(
            (val) =>
              val.PointStartId == marker.id ||
              val.PointEndId == marker.id,
          )
          .forEach((line) => {
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
        setValid(false);
        setWaitingAPI(false);
      })
      .catch((err) => {
        console.log(err);
        setWaitingAPI(false);
      });
  };

  //Update un marker
  let updateMarker = (markerId, changes) => {
    API.checkpoint
      .updateMarker({ id: markerId, ...changes })
      .then((marker) => {
        setValid(false);
        setMarkers((current) =>
          current.map((val) => (val.id === markerId ? marker : val)),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let getMarkerCoordsFromId = (id) => {
    var marker = markers.find((m) => m.id == id);
    return [marker.x, marker.y];
  };

  //Ajoute une ligne
  let addLine = (start, end) => {
    previewLine.shift();
    var newLine = {
      PointStartId: start.id,
      PointEndId: end.id,
      path: previewLine.map((p) => [p.lng, p.lat]),
      name: 'Segment ' + lines.length,
    };
    return API.segment
      .createSegment(newLine)
      .then((res) => {
        res.path = res.path.map((e) => [e[1], e[0]]);
        setLines((current) => [...current, res]);
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let updateLine = (lineId, changes) => {
    API.segment
      .updateSegment({ id: lineId, ...changes })
      .then((line) => {
        setLines((current) =>
          current.map((val) => (val.id === lineId ? line : val)),
        );
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
    var newObstacle = {
      title: 'Obstacle ' + obstacles.length,
      description: ' ',
      type: 'question',
      enigme_awnser: ' ',
      distance: 0.1,
      SegmentId: selectedLine.id,
    };
    return API.obstacle
      .createObstacle(newObstacle)
      .then((res) => {
        var coords = placeOnSegment(positions, res.distance);
        res.x = coords[1];
        res.y = coords[0];
        setObstacles((current) => [...current, res]);
        setCurrentObstacle(res);
        setModifyObstacle(true);
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let updateObstacle = (obstacleId, changes) => {
    API.obstacle
      .updateObstacle({ id: obstacleId, ...changes })
      .then((obstacle) => {
        setObstacles((current) =>
          current.map((val) =>
            val.id === obstacleId ? obstacle : val,
          ),
        );
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let removeObstacle = (obstacle) => {
    API.obstacle
      .deleteObstacle(obstacle.id)
      .then(() => {
        setObstacles((current) =>
          current.filter((val) => val != obstacle),
        );
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let addPreviewLine = (newPoint) => {
    var coords = newPoint.latlng;
    if (!inBounds(coords)) {
      coords = fitInBounds(coords);
    }
    if (previewLine == []) {
      setPreviewLine([coords]);
    } else {
      setPreviewLine((current) => [...current, coords]);
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
      addPreviewLine(contextMenu.event);
    }
    if (event === 'addMarkerJoined') {
      var newMarker = await addMarker(contextMenu.event);
      addPreviewLine(contextMenu.event);
      addLine(currentMarker, newMarker);
      setAddingLine(false);
      setPreviewLine([]);
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
    if (event === 'updateLine') {
      setModifyLine(true);
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
        {!isLoading ? (
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
              >
                <ImageOverlay
                  url={`https://api.acrobat.bigaston.dev/api/challenge/${challenge_id}/image`}
                  bounds={bounds}
                ></ImageOverlay>
                <Markers
                  addingLine={addingLine}
                  addPreviewLine={addPreviewLine}
                  markers={markers}
                  handleContext={handleContext}
                  updateMarker={updateMarker}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  setCurrentMarker={setCurrentMarker}
                  currentMarker={currentMarker}
                  setContextEvent={setContextEvent}
                  contextRef={contextRef}
                  addLine={addLine}
                  setAddingLine={setAddingLine}
                  setPreviewLine={setPreviewLine}
                  errorMarkers={errorMarkers}
                  setCurrentObstacle={setCurrentObstacle}
                />
                {!waitingAPI ? (
                  <Lines
                    lines={lines}
                    markers={markers}
                    updateLine={updateLine}
                    setSelectedLine={setSelectedLine}
                    handleContext={handleContext}
                  />
                ) : null}
                <Obstacles
                  obstacles={obstacles}
                  currentObstacle={currentObstacle}
                  lines={lines}
                  getMarkerCoordsFromId={getMarkerCoordsFromId}
                  handleContext={handleContext}
                  setCurrentMarker={setCurrentMarker}
                  setCurrentObstacle={setCurrentObstacle}
                />
                {currentMarker && previewLine ? (
                  <>
                    <Polyline
                      positions={[
                        [currentMarker.y, currentMarker.x],
                        ...previewLine,
                      ]}
                      color={'black'}
                    />
                    {currentMarker.type != 'end' ? (
                      <PreviewLine from={previewLine} />
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
              {selectedLine ? (
                <ModifyLinePopUp
                  modifyLine={modifyLine}
                  setModifyLine={setModifyLine}
                  setLines={setLines}
                  selectedLine={selectedLine}
                  updateLine={updateLine}
                  echelle={challenge.echelle}
                  getMarkerCoordsFromId={getMarkerCoordsFromId}
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
