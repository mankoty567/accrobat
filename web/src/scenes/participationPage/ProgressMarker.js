import React from 'react';
import { Marker } from 'react-leaflet';
import { createProgressIcon } from '../../components/MarkerIcons';
import placeOnSegment from '../../components/PlaceOnSegments';

export default function ProgressMarker({
  position,
  segments,
  markers,
  segmentsFinished,
}) {
  var coords = [0.5, 0.5];
  if (position.type == 'PointPassage') {
    coords = [position.entity.y, position.entity.x];
  }
  if (position.type == 'Segment') {
    var segment = position.entity;
    var startMarker = markers.find(
      (m) => m.id === segment.PointStartId,
    );
    var endMarker = markers.find((m) => m.id === segment.PointEndId);
    var positions = [
      [startMarker.y, startMarker.x],
      ...segment.path.map((elem) => {
        return [elem[0], elem[1]];
      }),
      [endMarker.y, endMarker.x],
    ];
    coords = placeOnSegment(positions, position.distance);
  }
  if (position.type == 'Obstacle') {
    var obstacle = position.entity;
    var segmentId = segmentsFinished.slice(-1).pop();
    var segment = segments.find((s) => s.id === segmentId);
    var startMarker = markers.find(
      (m) => m.id === segment.PointStartId,
    );
    var endMarker = markers.find((m) => m.id === segment.PointEndId);
    var positions = [
      [startMarker.y, startMarker.x],
      ...segment.path.map((elem) => {
        return [elem[0], elem[1]];
      }),
      [endMarker.y, endMarker.x],
    ];
    coords = placeOnSegment(positions, obstacle.distance);
  }
  return (
    <Marker
      key={'position'}
      position={[coords[0], coords[1]]}
      icon={createProgressIcon()}
    />
  );
}
