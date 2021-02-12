const bdd = require('../../models');

module.exports = {
  post_segment: (req, res) => {
    if (
      !req.body.distance ||
      !req.body.PointStartId ||
      !req.body.PointEndId ||
      !req.body.path
    ) {
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
                  path: req.body.path,
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
  get_segment: (req, res) => {
    bdd.Segment.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'path', 'distance', 'PointStartId', 'PointEndId'],
      include: [
        {
          model: bdd.PointPassage,
          as: 'pointStart',
          attributes: [
            'id',
            'title',
            'description',
            'type',
            'x',
            'y',
            'ChallengeId',
          ],
        },
        {
          model: bdd.PointPassage,
          as: 'pointEnd',
          attributes: [
            'id',
            'title',
            'description',
            'type',
            'x',
            'y',
            'ChallengeId',
          ],
        },
      ],
    }).then((segment) => {
      if (segment === null) {
        res.status(404).send('Segment not found');
      } else {
        res.json(segment);
      }
    });
  },
};
