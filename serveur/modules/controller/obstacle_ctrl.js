const bdd = require('../../models');
const debug = require('debug')('serveur:obstacle');
const path = require('path');
const utils = require('../utils');
const fs = require('fs');

const TYPE = ['question', 'action'];

module.exports = {
  post_obstacle: (req, res) => {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.type ||
      !TYPE.includes(req.body.type) ||
      !req.body.distance ||
      !req.body.SegmentId ||
      (req.body.type === 'question' && !req.body.enigme_awnser)
    ) {
      res.status(400).send('Bad request: One request body is not correct');
    } else {
      bdd.Segment.findOne({
        where: { id: req.body.SegmentId },
        include: {
          model: bdd.PointPassage,
          as: 'pointStart',
          include: bdd.Challenge,
        },
      }).then((segment) => {
        if (segment === null) {
          res.status(400).send('Bad Request: Segment not found');
        } else if (segment.pointStart.Challenge.published) {
          res.status(400).send('Bad request: Challenge is published');
        } else {
          if (req.body.distance > segment.distance) {
            res
              .status(400)
              .send('Bad Request: Distance of the obstacle is to big');
          }
          bdd.Obstacle.create({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            distance: req.body.distance,
            enigme_awnser:
              req.body.type === 'question' ? req.body.enigme_awnser : null,
            SegmentId: req.body.SegmentId,
          }).then((obstacle) => {
            utils.pngParser(req.body.enigme_img).then((buffer) => {
              fs.writeFileSync(
                path.join(
                  __dirname,
                  '../../data/obstacle/' + obstacle.id + '.jpg'
                ),
                buffer
              );
              debug('Création obstacle ' + obstacle.id);
              res.json(obstacle);
            });
          });
        }
      });
    }
  },
  update_obstacle: (req, res) => {
    bdd.Obstacle.findOne({
      where: { id: req.params.id },
      include: {
        model: bdd.Segment,
        include: {
          model: bdd.PointPassage,
          as: 'pointStart',
          include: bdd.Challenge,
        },
      },
    }).then((obstacle) => {
      if (obstacle === null) {
        res.status(404).send('Obstacle not found');
      } else if (obstacle.Segment.pointStart.Challenge.published) {
        res.status(400).send('Bad request: Challenge is published');
      } else {
        let edited = false;
        if (req.body.title) {
          obstacle.title = req.body.title;
          edited = true;
        }

        if (req.body.description) {
          obstacle.description = req.body.description;
          edited = true;
        }

        if (req.body.type) {
          obstacle.type = req.body.type;
          edited = true;
        }

        if (req.body.distance) {
          obstacle.distance = req.body.distance;
          edited = true;
        }

        if (req.body.enigme_img) {
          utils.pngParser(req.body.enigme_img).then((buffer) => {
            fs.writeFileSync(
              path.join(
                __dirname,
                '../../data/obstacle/' + obstacle.id + '.jpg'
              ),
              buffer
            );
          });
        }

        if (req.body.enigme_awnser) {
          obstacle.enigme_awnser = req.body.enigme_awnser;
          edited = true;
        }

        if (edited) {
          debug('Mise à jour de obstacle ' + obstacle.id);
          obstacle.save().then(() => {
            res.json(obstacle);
          });
        } else {
          res.json(obstacle);
        }
      }
    });
  },
  get_image: (req, res) => {
    bdd.Obstacle.findOne({
      where: { id: req.params.id },
    }).then((obstacle) => {
      if (obstacle === null || obstacle.enigme_img === null) {
        res.status(404).send('Not found');
      } else {
        res.sendFile(
          path.join(__dirname, '../../data/obstacle/' + obstacle.id + '.jpg')
        );
      }
    });
  },
  awnser_obstacle: (req, res) => {
    if (req.body.ParticipationId === undefined || !req.body.answer) {
      res.status(400).send('Bad Request');
    } else {
      bdd.Participation.findOne({
        where: { id: req.body.ParticipationId },
        include: [{ model: bdd.Event }],
        order: [[bdd.Event, 'id', 'DESC']],
      }).then((participation) => {
        if (participation === null) {
          res.status(400).send('Bad request: Participation not found');
        } else {
          let lastEvent = participation.Events[0];
          if (
            lastEvent.type !== 'obstacle:arrivee' &&
            lastEvent.type !== 'obstacle:bad_answer'
          ) {
            res.status(400).send('Bad request: Not in an obstacle');
          } else {
            bdd.Obstacle.findOne({
              where: { id: Math.trunc(lastEvent.data) },
            }).then((obstacle) => {
              if (!obstacle.type === 'question') {
                res.status(400).send('Bad request: Obstacle is not a question');
              } else {
                if (req.body.answer === obstacle.enigme_awnser) {
                  bdd.Event.create({
                    type: 'obstacle:completed',
                    ParticipationId: participation.id,
                  }).then(() => {
                    res.json({ good: true });
                  });
                } else {
                  bdd.Event.create({
                    type: 'obstacle:bad_answer',
                    ParticipationId: participation.id,
                    data: obstacle.id,
                  }).then(() => {
                    res.json({ good: false });
                  });
                }
              }
            });
          }
        }
      });
    }
  },
};
