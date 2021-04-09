const checkpoint = process.env.PUBLIC_URL + '/icons/Checkpoint.png';
const checkpointS = process.env.PUBLIC_URL + '/icons/CheckpointS.png';
const start = process.env.PUBLIC_URL + '/icons/Start.png';
const startS = process.env.PUBLIC_URL + '/icons/StartS.png';
const end = process.env.PUBLIC_URL + '/icons/End.png';
const endS = process.env.PUBLIC_URL + '/icons/EndS.png';
const shadow =
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

let createCheckpointIcon = (selected) => {
  return new L.Icon({
    iconUrl: selected ? checkpointS : checkpoint,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

let createEndIcon = (selected) => {
  return new L.Icon({
    iconUrl: selected ? endS : end,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

let createStartIcon = (selected) => {
  return new L.Icon({
    iconUrl: selected ? startS : start,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export { createCheckpointIcon, createEndIcon, createStartIcon };
