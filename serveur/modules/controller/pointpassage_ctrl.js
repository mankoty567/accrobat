const bdd = require('../../models');

const REQUIRED_TYPE = ['start', 'end', 'point'];

module.exports = {
  post_pointpassage: (req, res) => {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.type ||
      !REQUIRED_TYPE.includes(req.body.type)
    ) {
      res.status(400).send('Bad request');
    } else {
      bdd.Challenge.findByPk(req.params.id).then((challenge) => {
        if (challenge === null) {
          res.status(404).send('Challenge not exist');
        } else {
          bdd.PointPassage.create({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            x: req.body.x,
            y: req.body.y,
            ChallengeId: req.params.id,
          }).then((pointpassage) => {
            res.json(pointpassage);
          });
        }
      });
    }
  },
};
