let inBounds = (coords) => {
  return !(
    coords.lat < 0 ||
    coords.lat > 1 ||
    coords.lng < 0 ||
    coords.lng > 1
  );
};

let fitInBounds = (coords) => {
  if (coords.lat < 0) coords.lat = 0;
  if (coords.lat > 1) coords.lat = 1;
  if (coords.lng < 0) coords.lng = 0;
  if (coords.lng > 1) coords.lng = 1;
  return coords;
};

export { inBounds, fitInBounds };
