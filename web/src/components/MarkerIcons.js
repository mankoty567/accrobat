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
const obstacleA = process.env.PUBLIC_URL + '/icons/ObstacleA.png';
const obstacleQ = process.env.PUBLIC_URL + '/icons/ObstacleQ.png';
const obstacleAS = process.env.PUBLIC_URL + '/icons/ObstacleAS.png';
const obstacleQS = process.env.PUBLIC_URL + '/icons/ObstacleQS.png';
const progress = process.env.PUBLIC_URL + '/icons/Progress.png';
const lineAnchor = process.env.PUBLIC_URL + '/icons/LineAnchor.png';
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
    iconAnchor: [17, 17],
  });
};

let createProgressIcon = () => {
  return new L.Icon({
    iconUrl: progress,
    iconAnchor: [17, 17],
  });
};

let createLineAnchorIcon = () => {
  return new L.Icon({
    iconUrl: lineAnchor,
    iconAnchor: [6, 6],
  });
};

export {
  createCheckpointIcon,
  createEndIcon,
  createStartIcon,
  createObstacleIcon,
  createProgressIcon,
  createLineAnchorIcon,
};
