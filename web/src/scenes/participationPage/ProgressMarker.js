import React from 'react';
import { Marker } from 'react-leaflet';
import { createProgressIcon } from '../MarkerIcons';

export default function ProgressMarker({ position }) {
  var coords = { x: 0.5, y: 0.5 };
  if (position.type == 'PointPassage') {
    coords = {
      x: position.entity.pointPassage.x,
      y: position.entity.pointPassage.y,
    };
  }
  if (position.type == 'Segment') {
    //   coords = placeObstacle
  }
  console.log(coords);
  return (
    <Marker
      key={'position'}
      position={[coords.y, coords.x]}
      icon={createProgressIcon()}
    ></Marker>
  );
}
