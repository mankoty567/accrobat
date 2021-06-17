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

/**
 * Composant permettant d'afficher l'échelle sur la carte
 * @param {Number} echelle Échelle de la carte
 * @returns
 */
let Echelle = ({ echelle }) => {
  var positions = [
    [0, 0],
    [1, 1],
  ];
  var text = null;
  if (echelle >= 15000) {
    positions = [
      [0.1, 0.1],
      [0.1, 10000 / echelle],
    ];
    text = '10000 mètres';
  } else if (echelle >= 1500) {
    positions = [
      [0.1, 0.1],
      [0.1, 1000 / echelle],
    ];
    text = '1000 mètres';
  } else if (echelle >= 150) {
    positions = [
      [0.1, 0.1],
      [0.1, 100 / echelle],
    ];
    text = '100 mètres';
  } else {
    positions = [
      [0.1, 0.1],
      [0.1, 10 / echelle],
    ];
    text = '10 mètres';
  }
  return (
    <>
      <Marker position={positions[0]} icon={createLineAnchorIcon()} />
      <Polyline positions={positions} color={'black'}>
        <Tooltip direction="top">{text}</Tooltip>
      </Polyline>
      <Marker position={positions[1]} icon={createLineAnchorIcon()} />
    </>
  );
};

/**
 * Le Modal d'édition d'un Challenge
 * @param {Number} challenge_id L'id du Challenge à éditer
 * @param {Function} setSelected UseState permettant de définir le Challenge comme sélectionné ou non
 * @param {Boolean} open Boolean pour spécifier si le Modal est ouvert ou non
 * @param {Function} setOpen UseState permettant d'ouvrir et de fermer le Modal
 */
let ChallengeEditor = ({
  challenge_id,
  setSelected,
  open,
  setOpen,
}) => {
  //Utilisation des classes CSS
  const classes = useStyles();

  //Scale de la map
  const bounds = [
    [0, 0],
    [1, 1],
  ];

  //Variables d'interface
  const [challenge, setChallenge] = useState({
    id: '',
    title: '',
    description: '',
    echelle: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [markers, setMarkers] = useState([]);
  const [lines, setLines] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [errorMarkers, setErrorMarkers] = useState([]);

  const [modifyMarker, setModifyMarker] = useState(false);
  const [modifyLine, setModifyLine] = useState(false);
  const [modifyObstacle, setModifyObstacle] = useState(false);

  const [currentMarker, setCurrentMarker] = useState(null);
  const [currentLine, setCurrentLine] = useState(null);
  const [currentObstacle, setCurrentObstacle] = useState(null);

  //Doted line
  const [previewLine, setPreviewLine] = useState([]);
  //Segment en cours de création ?
  const [addingLine, setAddingLine] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [contextMenu, setContextEvent] = useState(undefined);
  const [valid, setValid] = useState(false);
  const [checkMessage, setCheckMessage] = useState({});

  const [waitingAPI, setWaitingAPI] = useState(false);

  const contextRef = useRef(undefined);

  /**
   * Fonction qui permet de récupérer les coordonnées d'un Marker via son Id
   * @param {Number} markerId
   * @returns
   */
  let getMarkerCoordsFromId = (markerId) => {
    var marker = markers.find((m) => m.id == markerId);
    return [marker.x, marker.y];
  };

  /**
   * Fonction qui met à jour la PreviewLine pour pouvoir voir à quoi va ressembler la line en cours de création
   * @param {Object} event Évenement Leaflet qui trigger la création de la PreviewLine
   */
  let addPreviewLine = (event) => {
    var coords = event.latlng;
    if (!inBounds(coords)) {
      coords = fitInBounds(coords);
    }
    if (previewLine == []) {
      setPreviewLine([coords]);
    } else {
      setPreviewLine((current) => [...current, coords]);
    }
  };

  /**
   * Fonction qui gère le clic droit dans l'application et met à jour le ContextEvent avec le type d'appel
   * @param {Object} event Évenemnt Leaflet
   * @param {String} type Type de l'appel (par exemple addMarker)
   */
  let handleContext = (event, type) => {
    event.originalEvent.preventDefault();
    setContextEvent({ event: event, type: type });
  };

  /**
   * Fonction qui crée l'appel aux fonctions via le clic droit
   * @param {Object} event Évenement Leaflet
   */
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

  /**
   * Fonction qui permet de sauvegarder les modifications du challenge et vérifier s'il est valide
   */
  let handleCheck = () => {
    API.challenge.checkValidity(challenge_id).then((data) => {
      updateChallenge(challenge);
      setErrorMarkers([]);
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

  /**
   * Fonction qui permet de publier le Challenge courant
   */
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

  /**
   * Récupère toutes les informations du challenge pour les afficher sur l'éditeur
   * @param {Number} challenge_id
   */
  const initializeMap = async (challenge_id) => {
    await API.challenge
      .getChallenge({
        challenge_id,
        include: 'pointsegmentobstacle',
      })
      .then((res) => {
        let newLines = [];
        let obstacles = [];
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
                  return [elem[0], elem[1]];
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

  /**
   * Met à jour le Challenge avec celui entré en paramètre
   * @param {Object} challenge
   */
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

  /**
   * Fonction qui ajoute un marker dans la base via l'évenement Leaflet
   * @param {Object} event Évenement Leaflet qui trigger la création du Marker
   */
  let addMarker = async (event) => {
    var coords = event.latlng;
    var newMarker = {
      title: 'Point ' + markers.length,
      description: '',
      type: markers.length > 0 ? 'point' : 'start',
      x: coords.lng,
      y: coords.lat,
    };
    if (!inBounds(coords)) coords = fitInBounds(coords);
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

  /**
   * Fonction qui supprime un marker
   * @param {Object} marker
   */
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

  /**
   * Fonction qui met à jour un Marker
   * @param {Number} markerId Id du Marker à update
   * @param {Object} changes Changements à effectuer sur le Marker
   */
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

  /**
   * Fonction qui ajoute la ligne PreviewLigne entre les Markers de début et d'arrivée
   * @param {Object} start PointStartId de la ligne
   * @param {Object} end PointEndId de la ligne
   */
  let addLine = (start, end) => {
    previewLine.shift();
    var newLine = {
      PointStartId: start.id,
      PointEndId: end.id,
      path: previewLine.map((p) => [p.lat, p.lng]),
      name: 'Segment ' + lines.length,
    };
    return API.segment
      .createSegment(newLine)
      .then((res) => {
        res.path = res.path;
        setLines((current) => [...current, res]);
        setValid(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * Fonction qui met à jour une ligne
   * @param {Number} lineId Id de la ligne à update
   * @param {Object} changes Changements à effectuer sur la ligne
   */
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

  /**
   * Fonction qui ajoute un obstacle à la currentLine
   */
  let addObstacle = async () => {
    var pointStart = getMarkerCoordsFromId(currentLine.PointStartId);
    var pointEnd = getMarkerCoordsFromId(currentLine.PointEndId);
    var positions = [
      [pointStart[1], pointStart[0]],
      ...currentLine.path.map((elem) => {
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
      SegmentId: currentLine.id,
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

  /**
   * Fonction qui met à jour un obstacle
   * @param {Number} obstacleId Id de l'obstacle à update
   * @param {Object} changes Changements à effectuer sur l'obstacle
   */
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

  /**
   * Fonction qui supprime un obstacle
   * @param {Object} obstacle Obstacle à supprimer
   */
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
              <Grid container spacing={5} justify="space-between">
                <Grid
                  item
                  xs={12}
                  style={{
                    height: '7vh',
                  }}
                >
                  <Grid
                    id="title"
                    style={{
                      // marginTop: 0,
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
                </Grid>
                <Grid
                  item
                  xs={5}
                  justify="center"
                  style={{
                    height: '83vh',
                  }}
                >
                  <ModifyChallenge
                    challenge={challenge}
                    setChallenge={setChallenge}
                  />
                </Grid>
                <Grid
                  item
                  xs={7}
                  style={{
                    height: '83vh',
                  }}
                >
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
                      <>
                        <Lines
                          lines={lines}
                          markers={markers}
                          updateLine={updateLine}
                          setCurrentLine={setCurrentLine}
                          handleContext={handleContext}
                        />
                        <Obstacles
                          obstacles={obstacles}
                          currentObstacle={currentObstacle}
                          lines={lines}
                          getMarkerCoordsFromId={
                            getMarkerCoordsFromId
                          }
                          handleContext={handleContext}
                          setCurrentMarker={setCurrentMarker}
                          setCurrentObstacle={setCurrentObstacle}
                        />
                      </>
                    ) : null}

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
                    <Echelle echelle={challenge.echelle} />
                  </MapContainer>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    height: '10vh',
                  }}
                >
                  <Grid container justify="center">
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
                  </Grid>
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
                {currentLine ? (
                  <ModifyLinePopUp
                    modifyLine={modifyLine}
                    setModifyLine={setModifyLine}
                    setLines={setLines}
                    currentLine={currentLine}
                    updateLine={updateLine}
                    echelle={challenge.echelle}
                    getMarkerCoordsFromId={getMarkerCoordsFromId}
                  />
                ) : null}
              </Grid>
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
