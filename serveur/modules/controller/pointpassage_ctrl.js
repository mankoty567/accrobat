const bdd = require('../../models');
const debug = require('debug')('serveur:pointpassage');

const REQUIRED_TYPE = ['start', 'end', 'point'];

module.exports = {
  get_pointpassage: (req, res) => {
    let query_obj = { where: { ChallengeId: req.params.id } };

    if (req.query.include === 'segment') {
      query_obj.include = [
        {
          model: bdd.Segment,
          as: 'pointStart',
        },
        {
          model: bdd.Segment,
          as: 'pointEnd',
        },
      ];
    }
    bdd.PointPassage.findAll(query_obj).then((pointpassages) => {
      res.json(pointpassages);
    });
  },
  post_pointpassage: (req, res) => {
    if (
      !req.body.title ||
      !req.body.type ||
      !REQUIRED_TYPE.includes(req.body.type) ||
      req.body.x === undefined ||
      req.body.y === undefined
    ) {
      res.status(400).send('Bad request');
    } else {
      bdd.Challenge.findByPk(req.params.id).then((challenge) => {
        if (challenge === null) {
          res.status(404).send('Challenge not exist');
        } else {
          bdd.PointPassage.create({
            title: req.body.title,
            description: req.body.description ? req.body.description : null,
            type: req.body.type,
            x: req.body.x,
            y: req.body.y,
            ChallengeId: req.params.id,
          }).then((pointpassage) => {
            debug('Création point passage ' + pointpassage.id);
            res.json(pointpassage);
          });
        }
      });
    }
  },
  delete_pointpassage: (req, res) => {
    bdd.PointPassage.findOne({ where: { id: req.params.id } }).then(
      (pointpassage) => {
        if (pointpassage === null) {
          res.status(404).send('PointPassage not found');
        } else {
          debug('Suppression point passage ' + pointpassage.id);
          pointpassage
            .destroy()
            .then(() => {
              res.send('OK');
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        }
      }
    );
  },
  update_pointpassage: (req, res) => {
    bdd.PointPassage.findOne({
      where: { id: req.params.id },
    }).then((pointpassage) => {
      if (pointpassage === null) {
        res.status(404).send('PointPassage not found');
      } else {
        let edited = false;

        if (req.body.title) {
          pointpassage.title = req.body.title;
          edited = true;
        }

        if (req.body.description) {
          pointpassage.description = req.body.description;
          edited = true;
        }

        if (req.body.x !== undefined) {
          pointpassage.x = req.body.x;
          edited = true;
        }

        if (req.body.y !== undefined) {
          pointpassage.y = req.body.y;
          edited = true;
        }

        if (edited) {
          debug('Update point passage ' + pointpassage.id);
          pointpassage.save().then(() => {
            res.json(pointpassage);
          });
        } else {
          res.json(pointpassage);
        }
      }
    });
  },
};
