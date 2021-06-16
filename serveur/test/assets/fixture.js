const bdd = require('../../models');
const fs = require('fs');
const path = require('path');

async function pasBonChallenge() {
  // Création d'un challenge pas bon
  const challenge = await bdd.Challenge.create({
    title: 'Un challenge pas bon',
    // eslint-disable-next-line quotes
    description: "Un challenge qui n'est pas bon au fond de lui même",
    echelle: 1,
    published: false,
  });

  fs.copyFileSync(
    path.join(__dirname, './map.webp'),
    path.join(__dirname, '../../data/challenge/' + challenge.id + '.webp')
  );

  const pointStart = await bdd.PointPassage.create({
    title: 'Un début des plus fameux',
    description:
      // eslint-disable-next-line quotes
      "Vous commencez donc votre aventure dans les terres sombres d'Hyrule...",
    type: 'start',
    ChallengeId: challenge.id,
    x: 0.1,
    y: 0.2,
  });

  const pointEnd = await bdd.PointPassage.create({
    title: 'Une fin en beautée!',
    description:
      // eslint-disable-next-line quotes
      'Vous voici donc maintenant arrivé à la fin de votre aventure!',
    type: 'end',
    ChallengeId: challenge.id,
    x: 0.8,
    y: 0.9,
  });

  const points = [];

  points[0] = await bdd.PointPassage.create({
    title: 'Par la gauche',
    description: 'Est-ce une bonne idée de passer par ici?',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.4,
    y: 0.4,
  });

  points[1] = await bdd.PointPassage.create({
    title: 'Par la droite',
    description: 'Est-ce une bonne idée de passer par là?',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.6,
    y: 0.6,
  });

  points[2] = await bdd.PointPassage.create({
    title: 'Bosquet Planqué',
    description: 'Vous ne viendrez jamais par ici!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.2,
    y: 0.2,
  });

  points[3] = await bdd.PointPassage.create({
    title: 'Cul de sac',
    description: 'Oh non!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.9,
    y: 0.9,
  });

  points[4] = await bdd.PointPassage.create({
    title: 'Début de la boucle',
    description: 'Oh non!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.9,
    y: 0.9,
  });

  points[5] = await bdd.PointPassage.create({
    title: '2ème pts de la boucle',
    description: 'Oh non!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.9,
    y: 0.9,
  });

  points[6] = await bdd.PointPassage.create({
    title: '3ème pts de la boucle',

    description: 'Oh non!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.9,
    y: 0.9,
  });

  points[7] = await bdd.PointPassage.create({
    title: '4ème pts de la boucle',
    description: 'Oh non!',
    type: 'point',
    ChallengeId: challenge.id,
    x: 0.9,
    y: 0.9,
  });

  const segments = [];

  segments[0] = await bdd.Segment.create({
    PointStartId: pointStart.id,
    PointEndId: points[0].id,
    path: [
      [pointStart.x, pointStart.y],
      [points[0].x, points[0].y],
    ],
  });

  segments[1] = await bdd.Segment.create({
    PointStartId: points[0].id,
    PointEndId: pointEnd.id,
    path: [
      [points[0].x, points[0].y],
      [pointEnd.x, pointEnd.y],
    ],
  });

  segments[2] = await bdd.Segment.create({
    PointStartId: pointStart.id,
    PointEndId: points[1].id,
    path: [
      [pointStart.x, pointStart.y],
      [points[1].x, points[1].y],
    ],
  });

  segments[3] = await bdd.Segment.create({
    PointStartId: points[1].id,
    PointEndId: pointEnd.id,
    path: [
      [points[1].x, points[1].y],
      [pointEnd.x, pointEnd.y],
    ],
  });

  segments[4] = await bdd.Segment.create({
    PointStartId: points[2].id,
    PointEndId: points[1].id,
    path: [
      [points[2].x, points[2].y],
      [points[1].x, points[1].y],
    ],
  });

  segments[5] = await bdd.Segment.create({
    PointStartId: points[1].id,
    PointEndId: points[3].id,
    path: [
      [points[1].x, points[1].y],
      [points[3].x, points[3].y],
    ],
  });

  segments[6] = await bdd.Segment.create({
    PointStartId: points[0].id,
    PointEndId: points[4].id,
    path: [
      [points[0].x, points[0].y],
      [points[4].x, points[4].y],
    ],
  });

  segments[7] = await bdd.Segment.create({
    PointStartId: points[4].id,
    PointEndId: points[5].id,
    path: [
      [points[4].x, points[4].y],
      [points[5].x, points[5].y],
    ],
  });

  segments[8] = await bdd.Segment.create({
    PointStartId: points[5].id,
    PointEndId: points[6].id,
    path: [
      [points[5].x, points[5].y],
      [points[6].x, points[6].y],
    ],
  });

  segments[9] = await bdd.Segment.create({
    PointStartId: points[6].id,
    PointEndId: points[7].id,
    path: [
      [points[6].x, points[6].y],
      [points[7].x, points[7].y],
    ],
  });

  segments[10] = await bdd.Segment.create({
    PointStartId: points[7].id,
    PointEndId: points[4].id,
    path: [
      [points[7].x, points[7].y],
      [points[4].x, points[4].y],
    ],
  });

  return challenge.id;
}

module.exports = { pasBonChallenge };
