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
      }).then((segment) => {
        if (segment === null) {
          res.status(400).send('Bad Request: Segment not found');
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
    }).then((obstacle) => {
      if (obstacle === null) {
        res.status(404).send('Obstacle not found');
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
};
