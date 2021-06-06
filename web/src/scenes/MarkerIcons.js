const checkpoint = process.env.PUBLIC_URL + '/icons/Checkpoint.png';
const checkpointS = process.env.PUBLIC_URL + '/icons/CheckpointS.png';
const checkpointE = process.env.PUBLIC_URL + '/icons/CheckpointE.png';
const checkpointES =
  process.env.PUBLIC_URL + '/icons/CheckpointES.png';
const start = process.env.PUBLIC_URL + '/icons/Start.png';
const startS = process.env.PUBLIC_URL + '/icons/StartS.png';
const startE = process.env.PUBLIC_URL + '/icons/StartE.png';
const startES = process.env.PUBLIC_URL + '/icons/StartES.png';
const end = process.env.PUBLIC_URL + '/icons/End.png';
const endS = process.env.PUBLIC_URL + '/icons/EndS.png';
const endE = process.env.PUBLIC_URL + '/icons/EndE.png';
const endES = process.env.PUBLIC_URL + '/icons/EndES.png';
const obstacleA = process.env.PUBLIC_URL + '/icons/obstacleA.png';
const obstacleE = process.env.PUBLIC_URL + '/icons/obstacleE.png';
const obstacleQ = process.env.PUBLIC_URL + '/icons/obstacleQ.png';
const obstacleAS = process.env.PUBLIC_URL + '/icons/obstacleAS.png';
const obstacleES = process.env.PUBLIC_URL + '/icons/obstacleES.png';
const obstacleQS = process.env.PUBLIC_URL + '/icons/obstacleQS.png';
const shadow =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

let createCheckpointIcon = (selected, error) => {
  var ES = selected && error;
  return new L.Icon({
    iconUrl: ES
      ? checkpointES
      : selected
      ? checkpointS
      : error
      ? checkpointE
      : checkpoint,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

let createEndIcon = (selected, error) => {
  var ES = selected && error;
  return new L.Icon({
    iconUrl: ES ? endES : selected ? endS : error ? endE : end,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

let createStartIcon = (selected, error) => {
  var ES = selected && error;
  return new L.Icon({
    iconUrl: ES
      ? startES
      : selected
      ? startS
      : error
      ? startE
      : start,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

let createObstacleIcon = (question, selected, error) => {
  return new L.Icon({
    iconUrl: selected
      ? question
        ? obstacleQS
        : obstacleAS
      : question
      ? obstacleQ
      : obstacleA,
    iconSize: [40, 40],
    shadowSize: [20, 20],
  });
};

export {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
  createObstacleIcon,
};
