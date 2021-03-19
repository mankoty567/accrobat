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
  const points = await bdd.PointPassage.findAll({
    where: { ChallengeId: challengeId },
  });

  points.forEach((p) => (pointAccessible[p.id] = false));

  function checkFromStart(point) {
    pointAccessible[point.id] = true;
  }
};
