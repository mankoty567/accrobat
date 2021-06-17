import React from 'react';
import { Marker } from 'react-leaflet';
import { createProgressIcon } from '../../components/MarkerIcons';
import placeOnSegment from '../../components/PlaceOnSegments';

export default function ProgressMarker({
  position,
  segments,
  markers,
}) {
  var coords = [0.5, 0.5];
  if (position.type == 'PointPassage') {
    coords = [position.entity.x, position.entity.y];
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
    coords = placeOnSegment(positions, position.distance).reverse();
  }
  if (position.type == 'Obstacle') {
    var obstacle = position.entity;
    var segment = segments.find((s) => (s.id = obstacle.SegmentId));
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
  return (
    <Marker
      key={'position'}
      position={[coords[1], coords[0]]}
      icon={createProgressIcon()}
    />
  );
}
