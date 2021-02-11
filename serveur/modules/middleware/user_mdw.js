const bdd = require('../../models');

module.exports = {
  put_user: (req, res, next) => {
    bdd.User.findByPk(1).then((user) => {
      req.user = user;
      next();
    });
  },
};
