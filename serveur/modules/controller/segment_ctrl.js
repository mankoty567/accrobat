const bdd = require('../../models');

module.exports = {
  post_segment: (req, res) => {
    if (!req.body.distance || !req.body.PointStartId || !req.body.PointEndId) {
      res.status(400).send('Bad request');
    } else {
      bdd.PointPassage.findOne({ where: { id: req.body.PointStartId } }).then(
        (ps) => {
          if (ps === null) {
            res.status(404).send('PointStart not found');
          } else {
            bdd.PointPassage.findOne({
              where: { id: req.body.PointEndId },
            }).then((pe) => {
              if (pe === null) {
                res.status(404).send('PointEnd not found');
              } else {
                bdd.Segment.create({
                  distance: req.body.distance,
                  PointStartId: req.body.PointStartId,
                  PointEndId: req.body.PointEndId,
                }).then((segment) => {
                  res.json(segment);
                });
              }
            });
          }
        }
      );
    }
  },
};
