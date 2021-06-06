const bdd = require('../../models');
const path = require('path');
const fs = require('fs');
const utils = require('../utils');
const debug = require('debug')('serveur:imagesubmition');

module.exports = {
  get_image: (req, res) => {
    if (
      fs.existsSync(
        path.join(
          __dirname,
          '../../data/imageSumbition/' + req.params.id + '.webp'
        )
      )
    ) {
      res.sendFile(
        path.join(
          __dirname,
          '../../data/imageSumbition/' + req.params.id + '.webp'
        )
      );
    } else {
      res.status(404).send('Image not found');
    }
  },
  post_image: (req, res) => {
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
          lastEvent.type !== 'obstacle:image_refused'
        ) {
          res.status(400).send('Bad request: Not in an obstacle');
        } else {
          bdd.Obstacle.findOne({
            where: { id: Math.trunc(lastEvent.data) },
          }).then((obstacle) => {
            if (obstacle.type !== 'action') {
              res.status(400).send('Bad request: Obstacle is not an action');
            } else {
              bdd.Event.create({
                type: 'obstacle:image',
                data: null,
                ParticipationId: participation.id,
              }).then((event) => {
                bdd.ImageSubmition.create({
                  EventId: event.id,
                  ObstacleId: obstacle.id,
                  ok: false,
                }).then((imagesubmition) => {
                  utils.parseImg(req.body.img_data).then((buffer) => {
                    fs.writeFileSync(
                      path.join(
                        __dirname,
                        '../../data/imageSubmition/' + event.id + '.webp'
                      ),
                      buffer
                    );
                    debug('Création imageSubmition pour event ' + event.id);
                    res.json(imagesubmition);
                  });
                });
              });
            }
          });
        }
      }
    });
  },
  get_all_soumission: (req, res) => {
    bdd.ImageSubmition.findAll({ where: { ok: false, rejected: false } }).then(
      (imagesubmition) => {
        res.json(imagesubmition);
      }
    );
  },
  juge_soumission: (req, res) => {
    bdd.ImageSubmition.findOne({
      where: { EventId: req.params.id },
    }).then((imagesubmition) => {
      if (imagesubmition === null) {
        res.status(404).send('Not found');
      } else {
        bdd.Event.findOne({
          where: { id: imagesubmition.EventId },
        }).then(async (event) => {
          if (req.body.valide) {
            imagesubmition.ok = true;
            await imagesubmition.save();

            await bdd.Event.create({
              type: 'obstacle:image_ok',
              ParticipationId: event.ParticipationId,
            });
            await bdd.Event.create({
              type: 'obstacle:completed',
              ParticipationId: event.ParticipationId,
            });

            res.send('OK');
          } else {
            imagesubmition.rejected = true;
            await imagesubmition.save();

            await bdd.Event.create({
              type: 'obstacle:image_refused',
              ParticipationId: event.ParticipationId,
              data: imagesubmition.ObstacleId,
            });

            res.send('OK');
          }
        });
      }
    });
  },
};
