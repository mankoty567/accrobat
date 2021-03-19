const bdd = require('../models');

/**
 * Condition d'un challenge terminé:
 * - Un seul point de départ
 * - Un seul point d'arrivé
 * - Une seule composante connexe
 *
 * Return obj = {valid: true/false, error: []}
 */
module.exports = async (challengeId) => {
  let obj = { valid: true, error: [] };
  const pointsStart = await bdd.PointPassage.findAll({
    where: { ChallengeId: challengeId, type: 'start' },
  });

  const pointsEnd = await bdd.PointPassage.findAll({
    where: { ChallengeId: challengeId, type: 'end' },
  });

  if (pointsStart.length !== 1) {
    obj.valid = false;
    obj.error.push('not_1_start');
  }

  if (pointsEnd.length !== 1) {
    obj.valid = false;
    obj.error.push('not_1_end');
  }

  // Si c'est déjà pété, on s'arrête
  if (!obj.valid) {
    return obj;
  }

  let pointAccessible = {};
  let pointVersEnd = {};
  let pointFromId = {};
  const points = await bdd.PointPassage.findAll({
    where: { ChallengeId: challengeId },
    include: [
      {
        model: bdd.Segment,
        as: 'pointStart',
      },
      {
        model: bdd.Segment,
        as: 'pointEnd',
      },
    ],
  });

  points.forEach((p) => {
    pointAccessible[p.id] = false;
    pointVersEnd[p.id] = false;
    pointFromId[p.id] = p;
  });

  points.forEach((p) => {
    if (p.type === 'start') {
      checkFromStart(p);
    }

    if (p.type === 'end') {
      checkFromEnd(p);
    }
  });

  function checkFromStart(point) {
    pointAccessible[point.id] = true;

    if (point.type == 'end') {
      return;
    }

    if (point.pointStart.length === 0) {
      obj.valid = false;
      obj.error.push('point_impasse:' + point.id);
      return;
    }

    point.pointStart.forEach((segment) => {
      if (!pointAccessible[segment.PointEndId]) {
        checkFromStart(pointFromId[segment.PointEndId]);
      }
    });
  }

  function checkFromEnd(point) {
    pointVersEnd[point.id] = true;

    if (point.type === 'start') {
      return;
    }

    if (point.pointEnd.length === 0) {
      return;
    }

    point.pointEnd.forEach((segment) => {
      if (!pointVersEnd[segment.PointStartId]) {
        checkFromEnd(pointFromId[segment.PointStartId]);
      }
    });
  }

  // Vérifications des points inaccessibles
  Object.keys(pointAccessible).forEach((k) => {
    if (!pointAccessible[k]) {
      obj.valid = false;
      obj.error.push('point_inaccessible:' + k);
    }
  });

  Object.keys(pointVersEnd).forEach((k) => {
    if (!pointVersEnd[k]) {
      obj.valid = false;
      obj.error.push('arrive_inaccessible:' + k);
    }
  });

  return obj;
};
