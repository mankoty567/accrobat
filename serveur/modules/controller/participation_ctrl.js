const bdd = require('../../models');
const debug = require('debug')('serveur:participation');

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
              } else if (!challenge.published) {
                res.status(400).send('Bad request: Challenge is not published');
              } else {
                bdd.Participation.create({
                  startDate: new Date(),
                  UserId: req.body.UserId,
                  ChallengeId: req.body.ChallengeId,
                }).then((participation) => {
                  debug('Création participation ' + participation.id);
                  res.json(participation);
                });
              }
            }
          );
        }
      });
    }
  },
  get_my_participation: (req, res) => {
    // TODO : Changer ça par un vrai user
    let user = { id: 1 };

    bdd.Participation.findAll({
      where: { UserId: user.id },
      attributes: ['id', 'startDate', 'endDate', 'UserId', 'ChallengeId'],
    }).then((participations) => {
      res.json(participations);
    });
  },
};
