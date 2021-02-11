const bdd = require('../../models');

module.exports = {
  get_all_challengecurrent: (req, res) => {
    bdd.ChallengeCurrent.findAll({
      attributes: ['id'],
      include: [
        {
          model: bdd.Participation,
          where: { UserId: req.user.id },
          required: true,
          attributes: ['startDate', 'id'],
          include: {
            model: bdd.Challenge,
            attributes: ['title', 'description', 'id'],
          },
        },
      ],
    }).then((challengeCurrent) => {
      res.json(challengeCurrent);
    });
  },
  get_one_challengecurrent: (req, res) => {
    bdd.ChallengeCurrent.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'distance', 'SegmentId', 'PointPassageId'],
      include: [
        {
          model: bdd.Participation,
          required: true,
          attributes: ['startDate', 'id', 'ChallengeId'],
        },
      ],
    }).then((challengeCurrent) => {
      if (challengeCurrent === null) {
        res.status(404).send('Not found');
      } else {
        res.json(challengeCurrent);
      }
    });
  },
  save_progression: (req, res) => {
    bdd.ChallengeCurrent.findOne({
      where: { id: req.params.id },
      include: bdd.Participation,
    }).then((challengeCurrent) => {
      if (req.body.PointPassageId !== undefined) {
        bdd.PointPassage.findOne({
          where: { id: req.body.PointPassageId },
        }).then((pointpassage) => {
          // Vérification de si le point de passage existe
          if (pointpassage === null) {
            res.status(400).send('Bad Request');
          } else {
            // Vérification de si le point de passage est bien dans le même challenge
            if (
              pointpassage.ChallengeId !==
              challengeCurrent.Participation.ChallengeId
            ) {
              res.status(400).send('Bad Request');
            } else {
              challengeCurrent.PointPassageId = pointpassage.id;
              challengeCurrent.distance = null;
              challengeCurrent.SegmentId = null;
              challengeCurrent.save().then(() => {
                res.json(challengeCurrent);
              });
            }
          }
        });
      } else if (
        req.body.SegmentId !== undefined &&
        req.body.distance !== undefined
      ) {
        bdd.Segment.findOne({
          where: { id: req.body.SegmentId },
          include: [
            { model: bdd.PointPassage, as: 'pointStart' },
            { model: bdd.PointPassage, as: 'pointEnd' },
          ],
        }).then((segment) => {
          // Vérification de si le segment existe
          if (segment === null) {
            res.status(400).send('Bad Request');
          } else {
            // Vérification de si la distance est pas plus grande que celle du segment
            if (req.body.distance > segment.distance) {
              res.status(400).send('Bad Request: Distance to long');
            } else if (req.body.distance === segment.distance) {
              challengeCurrent.PointPassageId = segment.PointEndId;
              challengeCurrent.distance = null;
              challengeCurrent.SegmentId = null;
              challengeCurrent.save().then(() => {
                res.json(challengeCurrent);
              });
            } else {
              // Vérification de son appartenance au bon challenge
              console.log(challengeCurrent.pointStart?.ChallengeId);
              if (
                segment.pointStart?.ChallengeId ===
                  challengeCurrent.Participation.ChallengeId ||
                segment.pointEnd?.ChallengeId ===
                  challengeCurrent.Participation.ChallengeId
              ) {
                challengeCurrent.PointPassageId = null;
                challengeCurrent.SegmentId = req.body.SegmentId;
                challengeCurrent.distance = req.body.distance;
                challengeCurrent.save().then(() => {
                  res.json(challengeCurrent);
                });
              } else {
                res.status(400).send('Bad Request: Not In Challenge');
              }
            }
          }
        });
      } else {
        res.status(400).send('Bad Request');
      }
    });
  },
};
