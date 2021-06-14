const bdd = require('../../models');
const debug = require('debug')('serveur:segment');

module.exports = {
  post_segment: (req, res) => {
    bdd.PointPassage.findOne({
      where: { id: req.body.PointStartId },
      include: bdd.Challenge,
    }).then((ps) => {
      if (ps === null) {
        res.status(404).send('PointStart not found');
      } else {
        if (ps.Challenge.published) {
          res.status(400).send('Bad request: Challenge is published');
        } else {
          bdd.PointPassage.findOne({
            where: { id: req.body.PointEndId },
            include: bdd.Challenge,
          }).then((pe) => {
            if (pe === null) {
              res.status(404).send('PointEnd not found');
            } else if (pe.Challenge.id !== ps.Challenge.id) {
              res
                .status(400)
                .send(
                  'Bad request: PointStart and PointEnd are not in the same challenge'
                );
            } else {
              bdd.Segment.create({
                PointStartId: req.body.PointStartId,
                PointEndId: req.body.PointEndId,
                path: req.body.path,
                name: req.body.name,
              }).then((segment) => {
                debug('Création segment' + segment.id);
                res.json({
                  ...segment.dataValues,
                  frondId: req.body.frontId,
                });
              });
            }
          });
        }
      }
    });
  },
  get_segment: (req, res) => {
    bdd.Segment.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'path', 'name', 'PointStartId', 'PointEndId'],
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
  update_segment: async (req, res) => {
    let segment = await bdd.Segment.findOne({
      where: { id: req.params.id },
      include: [
        { model: bdd.PointPassage, as: 'pointStart', include: bdd.Challenge },
        { model: bdd.PointPassage, as: 'pointEnd' },
      ],
    });
    if (segment === null) {
      res.status(404).send('Not Found');
    } else {
      if (segment.pointStart.Challenge.published) {
        res.status(400).send('Bad request: Challenge is published');
      } else {
        let edited = false;
        if (req.body.path !== undefined && Array.isArray(req.body.path)) {
          segment.path = req.body.path;
          edited = true;
        }

        if (req.body.name !== undefined) {
          segment.name = req.body.name;
          edited = true;
        }

        if (req.body.PointStartId !== undefined) {
          let pointStart = await bdd.PointPassage.findOne({
            where: { id: req.body.PointStartId },
          });
          if (pointStart.ChallengeId === segment.pointStart.ChallengeId) {
            segment.PointStartId = req.body.PointStartId;
            edited = true;
          }
        }

        if (req.body.PointEndId !== undefined) {
          let pointEnd = await bdd.PointPassage.findOne({
            where: { id: req.body.PointEndId },
          });
          if (pointEnd.ChallengeId === segment.pointEnd.ChallengeId) {
            segment.PointEndId = req.body.PointEndId;
            edited = true;
          }
        }

        if (edited) {
          debug('Update segment ' + segment.id);
          await segment.save();
          res.json({
            id: segment.id,
            distance: segment.distance,
            path: segment.path,
            name: segment.name,
            PointStartId: segment.PointStartId,
            PointEndId: segment.PointEndId,
          });
        } else {
          res.json({
            id: segment.id,
            distance: segment.distance,
            path: segment.path,
            name: segment.name,
            PointStartId: segment.PointStartId,
            PointEndId: segment.PointEndId,
          });
        }
      }
    }
  },
  delete_segment: (req, res) => {
    bdd.Segment.findOne({
      where: { id: req.params.id },
      include: {
        model: bdd.PointPassage,
        as: 'pointStart',
        include: bdd.Challenge,
      },
    }).then((segment) => {
      if (segment.pointStart.Challenge.published) {
        res.status(400).send('Bad request: Challenge is published');
      } else {
        debug('Suppression segment ' + segment.id);
        segment.destroy().then(res.send('OK'));
      }
    });
  },
};
