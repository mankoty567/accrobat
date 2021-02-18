const bdd = require('../../models');

module.exports = {
  post_participation: (req, res) => {
    if (req.body.UserId === undefined || req.body.ChallengeId === undefined) {
      res.status(400).send('Bad request');
    } else {
      bdd.User.findOne({ where: { id: req.body.UserId } }).then((user) => {
        if (user === null) {
          res.status(400).send('Bad request: User not found');
        } else {
          bdd.Challenge.findOne({ where: { id: req.body.ChallengeId } }).then(
            (challenge) => {
              if (challenge === null) {
                res.status(400).send('Bad request: Challenge not found');
              } else {
                bdd.Participation.create({
                  startDate: new Date(),
                  UserId: req.body.UserId,
                  ChallengeId: req.body.ChallengeId,
                }).then((participation) => {
                  res.json(participation);
                });
              }
            }
          );
        }
      });
    }
  },
};
