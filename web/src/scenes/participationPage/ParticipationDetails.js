import React, { useEffect, useState } from 'react';
import { CRS } from 'leaflet';
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  Marker,
  Tooltip,
} from 'react-leaflet';
import { Grid, Button, Modal } from '@material-ui/core';
import useStyles from '../MaterialUI';
import { API } from '../../eventApi/api';
import {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
  createObstacleIcon,
} from '../MarkerIcons';
import ProgressMarker from './ProgressMarker';

let ParticipationDetails = ({
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

  var participation_id = null;
  const [markers, setMarkers] = useState([]);
  const [segments, setSegments] = useState([]);
  const [segmentsFinished, setSegmentsFinished] = useState([]);
  const [position, setPosition] = useState(null);
  const [obstacles, setObstacles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState({
    id: '',
    title: '',
    description: '',
    echelle: 0,
  });

  // useEffect(() => console.log(position), [position]);

  let getIcon = (marker) => {
    switch (marker.type) {
      case 'start':
        return createStartIcon(false, false);
      case 'end':
        return createEndIcon(false, false);
      case 'point':
        return createCheckpointIcon(false, false);
    }
  };
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

  const initializeMap = async (challenge_id) => {
    await API.participation.getParticipations().then((res) => {
      res.forEach((participation) => {
        if (participation.ChallengeId == challenge_id)
          participation_id = participation.id;
      });
    });
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
        let newSegments = [];
        let obstacles = [];
        res.PointPassages.forEach((pp) => {
          pp.pointStart.forEach((segment) => {
            newSegments.push({
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
                SegmentId: obstacle.SegmentId,
                x: coords[1],
                y: coords[0],
              });
            });
          });
        });
        setObstacles(obstacles);
        setSegments(newSegments);
      })
      .then(() => {
        setIsLoading(true);
      });
    await API.participation
      .getProgression(participation_id)
      .then((res) => {
        setSegmentsFinished(res.segmentsParcourus);
        setPosition({
          type: res.type,
          entity: res.entity,
        });
      });
  };

  useEffect(() => initializeMap(challenge_id), []);

  return (
    <div className={classes.root}>
      <Modal
        aria-labelledby="title"
        aria-describedby="content"
        open={open}
      >
        {isLoading ? (
          <>
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
                  Avancement sur {challenge.title}
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
              <MapContainer
                className={classes.mapContainer}
                crs={CRS.Simple}
                center={[bounds[1][0] / 2, bounds[1][1] / 2]}
                bounds={bounds}
                maxBounds={bounds}
                zoom={9}
                maxZoom={11}
                minZoom={8}
              >
                <ImageOverlay
                  url={`https://api.acrobat.bigaston.dev/api/challenge/${challenge_id}/image`}
                  bounds={bounds}
                ></ImageOverlay>
                {markers.map((marker) => {
                  return (
                    <Marker
                      marker_index={marker.id}
                      key={marker.id}
                      position={[marker.y, marker.x]}
                      icon={getIcon(marker)}
                    >
                      <Tooltip
                        direction="top"
                        offset={[0, -40]}
                        permanent
                      >
                        {marker.title}
                      </Tooltip>
                    </Marker>
                  );
                })}
                {segments.map((element) => {
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
                        positions={positions}
                        key={'l' + element.id}
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
                      draggable={false}
                      key={item.id}
                      position={[item.y, item.x]}
                      icon={createObstacleIcon(
                        item.type == 'question',
                        false,
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
                {position ? (
                  <ProgressMarker
                    position={position}
                    placeObstacle={placeObstacle}
                  />
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

export default ParticipationDetails;
