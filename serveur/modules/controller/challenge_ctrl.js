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
        img_fond: req.body.img_fond,
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
};
