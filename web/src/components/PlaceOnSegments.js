// Récupérer les valeurs x,y des obstacles
function placeOnSegment(pointTab, pourcentage) {
  pourcentage *= 100;
  let distanceArray = [];
  let sum = 0;

  for (let i = 0; i < pointTab.length - 1; i++) {
    let p1 = { x: pointTab[i][0], y: pointTab[i][1] };
    let p2 = { x: pointTab[i + 1][0], y: pointTab[i + 1][1] };

    let distance = Math.sqrt(
      Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
    );

    distanceArray[i] = distance;
    sum = sum + distance;
  }

  let pourcentageArray = distanceArray.map((d) => (d * 100) / sum);

  let table = distanceArray.map((d, i) => ({
    distance: d,
    pourcentage: pourcentageArray[i],
  }));

  let segment = 0;

  let oldSum = 0;
  let totalSum = 0;
  let tableSum = table.map((t) => {
    oldSum = totalSum;
    totalSum = totalSum + t.pourcentage;
    return oldSum;
  });
  while (
    tableSum[segment + 1] < pourcentage &&
    segment < tableSum.length
  ) {
    segment = segment + 1;
  }

  let pourcentSomme = 0;

  for (let l = 0; l < segment; l++) {
    pourcentSomme = pourcentSomme + table[l].pourcentage;
  }

  let pourcentageInSegment = pourcentage - pourcentSomme;

  let obstaclePercent =
    (100 * pourcentageInSegment) / table[segment].pourcentage;

  let x =
    pointTab[segment][0] +
    (pointTab[segment + 1][0] - pointTab[segment][0]) *
      (obstaclePercent / 100);
  let y =
    pointTab[segment][1] +
    (pointTab[segment + 1][1] - pointTab[segment][1]) *
      (obstaclePercent / 100);

  return [x, y];
}

export default placeOnSegment;
