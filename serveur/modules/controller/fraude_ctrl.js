const bdd = require('../../models');

module.exports = {
  post_fraude: (req, res) => {
    bdd.Fraude.create({
      UserId: req.user.id,
    }).then(() => {
      res.send('OK');
    });
  },
  get_fraude: (req, res) => {
    bdd.Fraude.findAll({
      include: {
        model: bdd.User,
        attributes: ['id', 'username'],
      },
      order: [['createdAt', 'DESC']],
    }).then((fraudes) => {
      res.json(fraudes);
    });
  },
};
