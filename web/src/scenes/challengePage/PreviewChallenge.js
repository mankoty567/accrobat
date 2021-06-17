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
import useStyles from '../../components/MaterialUI';
import { API } from '../../eventApi/api';
import {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
  createObstacleIcon,
} from '../../components/MarkerIcons';
import placeOnSegment from '../../components/PlaceOnSegments';

let PreviewChallenge = ({
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
  const [obstacles, setObstacles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState({
    id: '',
    title: '',
    description: '',
    echelle: 0,
  });

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

  useEffect(() => console.log(open), [open]);

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
                  Prévisualisation de {challenge.title}
                </h2>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelected(null);
                    setOpen(!open);
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
                style={{
                  height: '90vh',
                }}
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
                        return [elem[0], elem[1]];
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

export default PreviewChallenge;
