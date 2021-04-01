const bdd = require('../../models');
const debug = require('debug')('serveur:obstacle');

const TYPE = ['question', 'action'];

module.exports = {
  post_obstacle: (req, res) => {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.type ||
      !TYPE.includes(req.body.type) ||
      !req.body.distance ||
      !req.body.enigme_img ||
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
            enigme_img: req.body.enigme_img,
            enigme_awnser:
              req.body.type === 'question' ? req.body.enigme_awnser : null,
            SegmentId: req.body.SegmentId,
          }).then((ostacle) => {
            debug('Création obstacle ' + ostacle.id);
            res.json(ostacle);
          });
        }
      });
    }
  },
};
