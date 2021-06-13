import React from 'react';
import { Marker } from 'react-leaflet';
import { createProgressIcon } from '../MarkerIcons';

export default function ProgressMarker({
  position,
  segments,
  markers,
  placeObstacle,
}) {
  console.log(position);
  var coords = [0.5, 0.5];
  if (position.type == 'PointPassage') {
    coords = [position.entity.y, position.entity.x];
  }
  if (position.type == 'Segment') {
    segment = position.entity;
    var startMarker = markers.find(
      (m) => m.id === segment.PointStartId,
    );
    var endMarker = markers.find((m) => m.id === segment.PointEndId);
    var positions = [
      [startMarker.y, startMarker.x],
      ...segment.path.map((elem) => {
        return [elem[1], elem[0]];
      }),
      [endMarker.y, endMarker.x],
    ];
    coords = placeObstacle(positions, position.distance / 100);
  }
  if (position.type == 'Obstacle') {
    obstacle = position.entity;
    var segment = segments.find((s) => (s.id = obstacle.SegmentId));
    var startMarker = markers.find(
      (m) => m.id === segment.PointStartId,
    );
    var endMarker = markers.find((m) => m.id === segment.PointEndId);
    var positions = [
      [startMarker.y, startMarker.x],
      ...segment.path.map((elem) => {
        return [elem[1], elem[0]];
      }),
      [endMarker.y, endMarker.x],
    ];
    coords = placeObstacle(positions, position.distance / 100);
  }
  return (
    <Marker
      key={'position'}
      position={[coords[0], coords[1]]}
      icon={createProgressIcon()}
    ></Marker>
  );
}
