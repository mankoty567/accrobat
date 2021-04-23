import React from 'react';
import {
  MenuItem,
  Paper,
  MenuList,
  Divider,
} from '@material-ui/core';

export default function ContextMenu({ data, onEvent }) {
  if (data != undefined) {
    var x = data.event.originalEvent.clientX;
    var y = data.event.originalEvent.clientY;
    return (
      <Paper
        style={{
          position: 'absolute',
          zIndex: 999,
          top: y,
          left: x,
          display: 'inline-block',
        }}
      >
        <MenuList>
          {data.type == 'map' ? (
            <MenuItem onClick={() => onEvent('addMarker')}>
              Ajouter un nouveau point
            </MenuItem>
          ) : null}
          {data.type == 'marker' ? (
            <div>
              <MenuItem onClick={() => onEvent('addLine')}>
                Ajouter un segment
              </MenuItem>
              <MenuItem onClick={() => onEvent('updateMarker')}>
                Modifier
              </MenuItem>
              <Divider />
              <MenuItem
                style={{ color: 'red', fontWeight: 'bold' }}
                onClick={() => onEvent('deleteMarker')}
              >
                Supprimer
              </MenuItem>
            </div>
          ) : null}
          {data.type == 'addingLine' ? (
            <MenuItem onClick={() => onEvent('addMarkerJoined')}>
              Lier à un nouveau point
            </MenuItem>
          ) : null}
          {data.type == 'line' ? (
            <MenuItem onClick={() => onEvent('addObstacle')}>
              Ajouter un obstacle
            </MenuItem>
          ) : null}
        </MenuList>
      </Paper>
    );
  } else {
    return <></>;
  }
}
