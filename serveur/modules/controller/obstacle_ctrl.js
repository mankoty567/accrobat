const bdd = require('../../models');
const debug = require('debug')('serveur:obstacle');
const path = require('path');
const utils = require('../utils');
const fs = require('fs');

module.exports = {
  post_obstacle: (req, res) => {
    if (req.body.type === 'question' && !req.body.enigme_awnser) {
      res.status(400).send('Bad request');
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
        } else {
          if (segment.pointStart.Challenge.published) {
            res.status(400).send('Bad request: Challenge is published');
          } else {
            bdd.Obstacle.create({
              title: req.body.title,
              description: req.body.description,
              type: req.body.type,
              distance: req.body.distance,
              enigme_awnser:
                req.body.type === 'question' ? req.body.enigme_awnser : null,
              SegmentId: req.body.SegmentId,
            }).then((obstacle) => {
              if (req.body.enigme_img !== undefined) {
                utils.parseImg(req.body.enigme_img).then((buffer) => {
                  fs.writeFileSync(
                    path.join(
                      __dirname,
                      '../../data/obstacle/' + obstacle.id + '.webp'
                    ),
                    buffer
                  );
                  debug('Création obstacle ' + obstacle.id);
                  res.json({
                    ...obstacle.dataValues,
                    frontId: req.body.frontId,
                  });
                });
              } else {
                debug('Création obstacle ' + obstacle.id);
                res.json({
                  ...obstacle.dataValues,
                  frontId: req.body.frontId,
                });
              }
            });
          }
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
      } else {
        if (obstacle.Segment.pointStart.Challenge.published) {
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
            utils.parseImg(req.body.enigme_img).then((buffer) => {
              fs.writeFileSync(
                path.join(
                  __dirname,
                  '../../data/obstacle/' + obstacle.id + '.webp'
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
              res.json({ ...obstacle.dataValues, Segment: undefined });
            });
          } else {
            res.json({ ...obstacle.dataValues, Segment: undefined });
          }
        }
      }
    });
  },
  delete_obstacle: (req, res) => {
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
      } else {
        if (
          fs.existsSync(
            path.join(__dirname, '../../data/obstacle/' + obstacle.id + '.webp')
          )
        ) {
          fs.unlinkSync(
            path.join(__dirname, '../../data/obstacle/' + obstacle.id + '.webp')
          );
        }
        obstacle
          .destroy()
          .then(() => {
            debug('Obstacle supprimé ' + obstacle.id);
            res.send('OK');
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send('Bad Request');
          });
      }
    });
  },
  get_image: (req, res) => {
    if (
      fs.existsSync(
        path.join(__dirname, '../../data/obstacle/' + req.params.id + '.webp')
      )
    ) {
      res.sendFile(
        path.join(__dirname, '../../data/obstacle/' + req.params.id + '.webp')
      );
    } else {
      res.status(404).send('Not found');
    }
  },
  awnser_obstacle: (req, res) => {
    if (req.body.ParticipationId === undefined || !req.body.awnser) {
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
              if (obstacle === null) {
                res.status(400).send('Obstacle is not correct');
              } else {
                if (obstacle.type !== 'question') {
                  res
                    .status(400)
                    .send('Bad request: Obstacle is not a question');
                } else {
                  if (req.body.awnser === obstacle.enigme_awnser) {
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
              }
            });
          }
        }
      });
    }
  },
};
