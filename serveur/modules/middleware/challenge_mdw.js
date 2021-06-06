const bdd = require('../../models');

module.exports = {
  check_is_author_fc: (challenge, user) => {
    return new Promise((resolve) => {
      bdd.UserChallengeAdmin.findOne({
        where: { ChallengeId: challenge, UserId: user },
      }).then((ca) => {
        if (ca === null) {
          resolve(false);
        } else {
          resolve(ca.isAuthor);
        }
      });
    });
  },
  check_is_challenge_admin_fc: (challenge, user) => {
    return new Promise((resolve) => {
      bdd.UserChallengeAdmin.findOne({
        where: { ChallengeId: challenge, UserId: user },
      }).then((ca) => {
        resolve(ca !== null);
      });
    });
  },
  check_is_admin: (req, res, next) => {
    module.exports
      .check_is_challenge_admin_fc(req.params.id, req.user.id)
      .then((isAdmin) => {
        if (isAdmin) {
          next();
        } else {
          res.status(403).send('You are not admin of this challenge');
        }
      });
  },
  check_is_author: (req, res, next) => {
    module.exports
      .check_is_author_fc(req.params.id, req.user.id)
      .then((isAuthor) => {
        if (isAuthor) {
          next();
        } else {
          res.status(403).send('You are not admin of this challenge');
        }
      });
  },
};
