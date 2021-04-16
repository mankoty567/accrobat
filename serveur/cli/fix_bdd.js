const bdd = require('../models');

bdd.Challenge.findAll().then((challenges) => {
  challenges.forEach((c) => {
    bdd.UserChallengeAdmin.create({
      isAuthor: true,
      ChallengeId: c.id,
      UserId: 1,
    });
  });
});
