const bdd = require('../../models');
const debug = require('debug')('serveur:challenge');
const utils = require('../utils');
const path = require('path');
const fs = require('fs');

module.exports = {
  get_challenge_id: (req, res) => {
    let query = {
      where: { id: req.params.id },
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
    };

    if (req.query.include === 'point') {
      query.include = [{ model: bdd.PointPassage }];
    } else if (req.query.include === 'pointsegment') {
      query.include = [
        {
          model: bdd.PointPassage,
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
        },
      ];
    } else if (req.query.include === 'pointsegmentobstacle') {
      query.include = [
        {
          model: bdd.PointPassage,
          include: [
            {
              model: bdd.Segment,
              as: 'pointStart',
              include: [
                {
                  model: bdd.Obstacle,
                  attributes: [
                    'id',
                    'title',
                    'description',
                    'type',
                    'distance',
                    'SegmentId',
                  ],
                },
              ],
            },
            {
              model: bdd.Segment,
              as: 'pointEnd',
              include: [
                {
                  model: bdd.Obstacle,
                  attributes: [
                    'id',
                    'title',
                    'description',
                    'type',
                    'distance',
                    'SegmentId',
                  ],
                },
              ],
            },
          ],
        },
      ];
    }
    bdd.Challenge.findOne(query).then((challenge) => {
      if (challenge !== null) {
        res.json(challenge);
      } else {
        res.status(404).send('Not found');
      }
    });
  },
  get_image: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
    }).then((challenge) => {
      if (challenge === null) {
        res.status(404).send('Not found');
      } else {
        res.sendFile(
          path.join(__dirname, '../../data/challenge/' + challenge.id + '.jpg')
        );
      }
    });
  },
  post_challenge: (req, res) => {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.img_fond ||
      !req.body.echelle
    ) {
      res.status(400).send('Bad request');
    } else {
      bdd.Challenge.create({
        title: req.body.title,
        description: req.body.description,
        echelle: req.body.echelle,
      }).then((challenge) => {
        utils.pngParser(req.body.img_fond).then((buffer) => {
          fs.writeFileSync(
            path.join(
              __dirname,
              '../../data/challenge/' + challenge.id + '.jpg'
            ),
            buffer
          );
          debug('Création du challenge ' + challenge.id);
          res.json(challenge);
        });
      });
    }
  },
  delete_challenge: (req, res) => {
    bdd.Challenge.findOne({ where: { id: req.params.id } }).then(
      (challenge) => {
        if (challenge === null) {
          res.status(404).send('Not found');
        } else {
          debug('Suppression du challenge ' + challenge.id);
          challenge
            .destroy()
            .then(() => {
              fs.unlinkSync(
                path.join(
                  __dirname,
                  '../../data/challenge/' + challenge.id + '.jpg'
                )
              );
              res.send('OK');
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send('Error during delete');
            });
        }
      }
    );
  },
  update_challenge: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
    }).then((challenge) => {
      if (challenge === null) {
        res.status(404).send('Challenge not found');
      } else {
        let edited = false;
        if (req.body.title) {
          challenge.title = req.body.title;
          edited = true;
        }

        if (req.body.description) {
          challenge.description = req.body.description;
          edited = true;
        }

        if (req.body.img_fond) {
          utils.pngParser(req.body.img_fond).then((buffer) => {
            fs.writeFileSync(
              path.join(
                __dirname,
                '../../data/challenge/' + challenge.id + '.jpg'
              ),
              buffer
            );
          });
        }

        if (req.body.echelle) {
          challenge.echelle = req.body.echelle;
          edited = true;
        }

        if (edited) {
          debug('Mise à jour du challenge ' + challenge.id);
          challenge.save().then(() => {
            res.json(challenge);
          });
        } else {
          res.json(challenge);
        }
      }
    });
  },
  clone_challenge: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
      include: {
        model: bdd.PointPassage,
        include: [
          {
            model: bdd.Segment,
            include: bdd.Obstacle,
            as: 'pointStart',
          },
        ],
      },
    }).then((challenge) => {
      bdd.Challenge.create({
        title: challenge.title,
        description: challenge.description,
        echelle: challenge.echelle,
        published: false,
      }).then(async (newChallenge) => {
        if (
          fs.existsSync(
            path.join(
              __dirname,
              '../../data/challenge/' + challenge.id + '.jpg'
            )
          )
        ) {
          fs.copyFileSync(
            path.join(
              __dirname,
              '../../data/challenge/' + challenge.id + '.jpg'
            ),
            path.join(
              __dirname,
              '../../data/challenge/' + newChallenge.id + '.jpg'
            )
          );

          let segments = [];
          let obstacles = [];
          let pointAssociation = {};
          let segmentAssociation = {};

          // Clone des points de passages
          for (const point of challenge.PointPassages) {
            const newPoint = await bdd.PointPassage.create({
              title: point.title,
              description: point.description,
              type: point.type,
              x: point.x,
              y: point.y,
              ChallengeId: newChallenge.id,
            });

            // Ajout du segment à la liste de tous les segments
            point.pointStart.forEach((s) => segments.push(s));

            // Association des anciens points de passages aux nouveaux
            pointAssociation[point.id] = newPoint.id;
          }

          // Clone des segments
          for (const segment of segments) {
            const newSegment = await bdd.Segment.create({
              PointStartId: pointAssociation[segment.PointStartId],
              PointEndId: pointAssociation[segment.PointEndId],
              path: segment.path,
            });

            // Ajout des obstacles à la liste de tous les obstacles
            segment.Obstacles.forEach((o) => obstacles.push(o));

            // Association des anciens segments aux nouveaux
            segmentAssociation[segment.id] = newSegment.id;
          }

          for (const obstacle of obstacles) {
            const newObstacle = await bdd.Obstacle.create({
              title: obstacle.title,
              description: obstacle.description,
              type: obstacle.type,
              distance: obstacle.distance,
              enigme_awnser: obstacle.enigme_awnser,
              SegmentId: segmentAssociation[obstacle.SegmentId],
            });

            if (
              fs.existsSync(
                path.join(
                  __dirname,
                  '../../data/obstacle/' + obstacle.id + '.jpg'
                )
              )
            ) {
              fs.copyFileSync(
                path.join(
                  __dirname,
                  '../../data/obstacle/' + obstacle.id + '.jpg'
                ),
                path.join(
                  __dirname,
                  '../../data/obstacle/' + newObstacle.id + '.jpg'
                )
              );
            }
          }

          res.json(newChallenge);
        }
      });
    });
  },
  get_all_challenge: (req, res) => {
    bdd.Challenge.findAll({
      where: { published: true },
      attributes: ['id', 'title', 'description', 'echelle'],
    }).then((challenges) => {
      res.json(challenges);
    });
  },
};
