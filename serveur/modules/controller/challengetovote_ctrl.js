const bdd = require('../../models');

module.exports = {
  add_tovote: (req, res) => {
    bdd.ChallengeToVote.create({
      description: req.body.description,
      status: 'open',
    }).then(() => {
      res.send('OK');
    });
  },
  update_tovote: (req, res) => {
    bdd.ChallengeToVote.findOne({ where: { id: req.params.id } }).then(
      (tovote) => {
        if (tovote === null) {
          res.status(404).send('Not found');
        } else {
          tovote.status = req.body.status;
          tovote.save().then(() => {
            res.json(tovote);
          });
        }
      }
    );
  },
  vote: (req, res) => {
    bdd.UserChallengeToVote.findOne({
      where: { UserId: req.user.id, ChallengeToVoteId: req.params.id },
    }).then((tovote) => {
      if (tovote === null) {
        bdd.ChallengeToVote.findOne({ where: { id: req.params.id } }).then(
          (challenge) => {
            if (challenge === null) {
              res.status(404).send('ChallengeToVote not found');
            } else {
              bdd.UserChallengeToVote.create({
                vote: req.body.vote,
                ChallengeToVoteId: req.params.id,
                UserId: req.user.id,
              }).then(() => {
                res.send('OK');
              });
            }
          }
        );
      } else {
        tovote.vote = req.body.vote;
        tovote.save().then(() => {
          res.send('OK');
        });
      }
    });
  },
};
