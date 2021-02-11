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
      attributes: ['id', 'SegmentId', 'PointPassageId'],
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
};
