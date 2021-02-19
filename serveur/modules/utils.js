module.exports = {
  pathToDistance: (path, echelle) => {
    let distance = 0;

    for (let i = 0; i < path.length - 1; i++) {
      distance =
        distance +
        Math.sqrt(
          Math.pow(path[i][0] - path[i + 1][0]) +
            Math.pow(path[i][1] - path[i + 1][1])
        );
    }

    return distance * echelle;
  },
};
