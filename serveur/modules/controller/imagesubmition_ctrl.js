const bdd = require('../../models');
const path = require('path');
const fs = require('fs');
const utils = require('../utils');
const debug = require('debug')('serveur:imagesubmition');

module.exports = {
  get_image: (req, res) => {
    bdd.ImageSubmition.findOne({
      where: { EventId: req.params.id },
    }).then((imagesubmition) => {
      if (imagesubmition === null) {
        res.status(404).send('Not found');
      } else {
        res.sendFile(
          path.join(
            __dirname,
            '../../data/imageSumbition/' + imagesubmition.id + '.jpg'
          )
        );
      }
    });
  },
  post_image: (req, res) => {
    if (req.body.ParticipationId === undefined || !req.body.img_data) {
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
          if (lastEvent.type !== 'obstacle:arrivee') {
            res.status(400).send('Bad request: Not in an obstacle');
          } else {
            bdd.Obstacle.findOne({
              where: { id: Math.trunc(lastEvent.data) },
            }).then((obstacle) => {
              if (!obstacle.type === 'action') {
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
                    utils.pngParser(req.body.img_data).then((buffer) => {
                      fs.writeFileSync(
                        path.join(
                          __dirname,
                          '../../data/imageSubmition/' + event.id + '.jpg'
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
    }
  },
};
