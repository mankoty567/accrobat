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
};
