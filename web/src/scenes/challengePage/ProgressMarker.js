import React from 'react';
import { Marker } from 'react-leaflet';
import { createProgressIcon } from '../MarkerIcons';

export default function ProgressMarker({
  position,
  segments,
  markers,
  obstacles,
  placeObstacles,
}) {
  console.log(position);
  var coords = { x: 0.5, y: 0.5 };
  if (position.type == 'PointPassage') {
    coords = {
      x: position.entity.x,
      y: position.entity.y,
    };
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
    var coords = placeObstacle(positions, position.distance);
  }
  if (position.type == 'obstacle') {
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
    var coords = placeObstacle(positions, obstacle.distance);
  }
  return (
    <Marker
      key={'position'}
      position={[coords.y, coords.x]}
      icon={createProgressIcon()}
    ></Marker>
  );
}
