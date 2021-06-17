import React from 'react';
import {
  MenuItem,
  Paper,
  MenuList,
  Divider,
} from '@material-ui/core';

/**
 * Menu lors d'un clic droit sur la map
 * @param {String} data Le type de la donnée à afficher
 * @param {String} onEvent La fonction à exécuter lors d'un event
 */
export default function ContextMenu({ data, onEvent }) {
  if (data != undefined) {
    //Variables d'interface
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
            <div>
              <MenuItem onClick={() => onEvent('addObstacle')}>
                Ajouter un obstacle
              </MenuItem>
              <MenuItem onClick={() => onEvent('updateLine')}>
                Modifier
              </MenuItem>
            </div>
          ) : null}
          {data.type == 'obstacle' ? (
            <div>
              <MenuItem onClick={() => onEvent('updateObstacle')}>
                Modifier
              </MenuItem>
              <Divider />
              <MenuItem
                style={{ color: 'red', fontWeight: 'bold' }}
                onClick={() => onEvent('deleteObstacle')}
              >
                Supprimer
              </MenuItem>
            </div>
          ) : null}
        </MenuList>
      </Paper>
    );
  } else {
    return <></>;
  }
}
