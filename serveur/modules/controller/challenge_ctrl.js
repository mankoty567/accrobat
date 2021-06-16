const bdd = require('../../models');
const debug = require('debug')('serveur:challenge');
const utils = require('../utils');
const path = require('path');
const fs = require('fs');

module.exports = {
  get_challenge_id: (req, res) => {
    let query = {
      where: { id: req.params.id },
      attributes: [
        'id',
        'title',
        'description',
        'echelle',
        'createdAt',
        'updatedAt',
      ],
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
    if (
      fs.existsSync(
        path.join(__dirname, '../../data/challenge/' + req.params.id + '.webp')
      )
    ) {
      res.sendFile(
        path.join(__dirname, '../../data/challenge/' + req.params.id + '.webp')
      );
    } else {
      res.status(404).send('Map not found');
    }
  },
  get_image_avatar: (req, res) => {
    if (
      fs.existsSync(
        path.join(
          __dirname,
          '../../data/challengeAvatar/' + req.params.id + '.webp'
        )
      )
    ) {
      res.sendFile(
        path.join(
          __dirname,
          '../../data/challengeAvatar/' + req.params.id + '.webp'
        )
      );
    } else {
      res.status(404).send('Avatar not found');
    }
  },
  post_challenge: (req, res) => {
    bdd.Challenge.create({
      title: req.body.title,
      description: req.body.description,
      echelle: req.body.echelle,
    }).then((challenge) => {
      utils.parseMap(req.body.img_fond).then((buffer) => {
        fs.writeFileSync(
          path.join(
            __dirname,
            '../../data/challenge/' + challenge.id + '.webp'
          ),
          buffer
        );

        if (req.body.img_avatar !== undefined) {
          utils.parseAvatar(req.body.img_avatar).then((bufferAvater) => {
            fs.writeFileSync(
              path.join(
                __dirname,
                '../../data/challengeAvatar/' + challenge.id + '.webp'
              ),
              bufferAvater
            );
            debug('Création du challenge ' + challenge.id);
            res.json({
              ...challenge.dataValues,
              frontId: req.body.frontId,
            });
          });
        } else {
          debug('Création du challenge ' + challenge.id);
          res.json({ ...challenge.dataValues, frontId: req.body.frontId });
        }
      });
    });
  },
  delete_challenge: (req, res) => {
    bdd.Challenge.findOne({ where: { id: req.params.id } }).then(
      (challenge) => {
        if (challenge === null) {
          res.status(404).send('Not found');
        } else {
          if (challenge.published) {
            res.status(400).send('Bad Request: Challenge is published');
            return;
          }
          debug('Suppression du challenge ' + challenge.id);
          challenge
            .destroy()
            .then(() => {
              fs.unlinkSync(
                path.join(
                  __dirname,
                  '../../data/challenge/' + challenge.id + '.webp'
                )
              );

              if (
                fs.existsSync(
                  path.join(
                    __dirname,
                    '../../data/challengeAvatar/' + challenge.id + '.webp'
                  )
                )
              ) {
                fs.unlinkSync(
                  path.join(
                    __dirname,
                    '../../data/challengeAvatar/' + challenge.id + '.webp'
                  )
                );
              }
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
        if (challenge.published) {
          res.status(400).send('Bad Request: Challenge is published');
          return;
        }

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
          utils.parseMap(req.body.img_fond).then((buffer) => {
            fs.writeFileSync(
              path.join(
                __dirname,
                '../../data/challenge/' + challenge.id + '.webp'
              ),
              buffer
            );
          });
        }

        if (req.body.img_avatar) {
          utils.parseAvatar(req.body.img_avatar).then((buffer) => {
            fs.writeFileSync(
              path.join(
                __dirname,
                '../../data/challengeAvatar/' + challenge.id + '.webp'
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
    }).then(async (challenge) => {
      try {
        let t = await bdd.sequelize.transaction();
        let newChallenge = await bdd.Challenge.create(
          {
            title: challenge.title,
            description: challenge.description,
            echelle: challenge.echelle,
            published: false,
          },
          { transaction: t }
        );

        if (
          fs.existsSync(
            path.join(
              __dirname,
              '../../data/challenge/' + challenge.id + '.webp'
            )
          )
        ) {
          fs.copyFileSync(
            path.join(
              __dirname,
              '../../data/challenge/' + challenge.id + '.webp'
            ),
            path.join(
              __dirname,
              '../../data/challenge/' + newChallenge.id + '.webp'
            )
          );
        }

        let segments = [];
        let obstacles = [];
        let pointAssociation = {};
        let segmentAssociation = {};

        // Clone des points de passages
        for (const point of challenge.PointPassages) {
          const newPoint = await bdd.PointPassage.create(
            {
              title: point.title,
              description: point.description,
              type: point.type,
              x: point.x,
              y: point.y,
              ChallengeId: newChallenge.id,
            },
            { transaction: t }
          );

          // Ajout du segment à la liste de tous les segments
          point.pointStart.forEach((s) => segments.push(s));

          // Association des anciens points de passages aux nouveaux
          pointAssociation[point.id] = newPoint.id;
        }

        // Clone des segments
        for (const segment of segments) {
          const newSegment = await bdd.Segment.create(
            {
              PointStartId: pointAssociation[segment.PointStartId],
              PointEndId: pointAssociation[segment.PointEndId],
              path: segment.path,
              name: segment.name,
            },
            { transaction: t }
          );

          // Ajout des obstacles à la liste de tous les obstacles
          segment.Obstacles.forEach((o) => obstacles.push(o));

          // Association des anciens segments aux nouveaux
          segmentAssociation[segment.id] = newSegment.id;
        }

        for (const obstacle of obstacles) {
          const newObstacle = await bdd.Obstacle.create(
            {
              title: obstacle.title,
              description: obstacle.description,
              type: obstacle.type,
              distance: obstacle.distance,
              enigme_awnser: obstacle.enigme_awnser,
              SegmentId: segmentAssociation[obstacle.SegmentId],
            },
            { transaction: t }
          );

          if (
            fs.existsSync(
              path.join(
                __dirname,
                '../../data/obstacle/' + obstacle.id + '.webp'
              )
            )
          ) {
            fs.copyFileSync(
              path.join(
                __dirname,
                '../../data/obstacle/' + obstacle.id + '.webp'
              ),
              path.join(
                __dirname,
                '../../data/obstacle/' + newObstacle.id + '.webp'
              )
            );
          }
        }

        await t.commit();
        res.json(newChallenge);
      } catch (err) {
        console.log(err);
        debug(err);
        res.status(400).send('Something went wrong');
      }
    });
  },
  get_all_challenge: (req, res) => {
    let query = {
      where: { published: true },
      attributes: ['id', 'title', 'description', 'echelle', 'createdAt'],
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
    bdd.Challenge.findAll(query).then((challenges) => {
      res.json(challenges);
    });
  },
  get_all_challenge_admin: (req, res) => {
    let query = {
      attributes: [
        'id',
        'title',
        'description',
        'echelle',
        'createdAt',
        'published',
      ],
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
    bdd.Challenge.findAll(query).then((challenges) => {
      res.json(challenges);
    });
  },
  verif_validity: async (req, res) => {
    res.json(await require('../challengeValidation')(req.params.id));
  },
  publish_challenge: async (req, res) => {
    const challenge = await bdd.Challenge.findOne({
      where: { id: req.params.id },
    });

    if (challenge === null) {
      res.status(404).send('Challenge not found');
    } else {
      const valid = await require('../challengeValidation')(challenge.id);
      if (valid.valid) {
        challenge.published = true;
        await challenge.save();
        res.json(challenge);
      } else {
        res.status(400).send('Challenge is not valid');
      }
    }
  },
  get_records: (req, res) => {
    bdd.Challenge.findOne({ where: { id: req.params.id } }).then(
      (challenge) => {
        if (challenge === null) {
          res.status(400).send('Challenge not found');
        } else {
          bdd.Participation.findAll({
            where: {
              ChallengeId: req.params.id,
              endDate: { [bdd.Sequelize.Op.ne]: null },
            },
            include: [{ model: bdd.User, attributes: ['username', 'id'] }],
          }).then((participations) => {
            participations = participations.map((p) => {
              p = JSON.parse(JSON.stringify(p));

              p.duration =
                new Date(p.endDate).getTime() - new Date(p.startDate).getTime();

              return p;
            });
            participations.sort((a, b) => {
              return a.duration - b.duration;
            });

            let max = Math.min(20, req.query.nb || 5);

            participations = participations.slice(0, max);

            res.json(
              participations.map((p) => {
                let durationObj = utils.parseDuration(p.duration);

                return {
                  id: p.id,
                  duration: p.duration,
                  durationStr: `${durationObj.jour}j ${durationObj.heure}:${durationObj.minute}'${durationObj.seconde}`,
                  startDate: p.startDate,
                  endDate: p.endDate,
                  user: p.User,
                };
              })
            );
          });
        }
      }
    );
  },
};
