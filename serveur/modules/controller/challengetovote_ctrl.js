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
          let edited = false;

          if (req.body.status !== undefined) {
            tovote.status = req.body.status;
            edited = true;
          }

          if (req.body.description !== undefined) {
            tovote.description = req.body.description;
            edited = true;
          }

          if (edited) {
            tovote.save().then(() => {
              res.json(tovote);
            });
          } else {
            res.json(tovote);
          }
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
  get_challengetovote: (req, res) => {
    bdd.ChallengeToVote.findAll({
      where: { status: 'open' },
      include: { model: bdd.User, where: { id: req.user.id }, required: false },
    }).then((challenges) => {
      let challengeReturn = challenges.map((c) => {
        c = JSON.parse(JSON.stringify(c));

        if (c.Users.length === 0) {
          c.vote = null;
        } else {
          c.vote = c.Users[0].UserChallengeToVote.vote;
        }

        delete c.Users;

        return c;
      });

      res.json(challengeReturn);
    });
  },
  get_challengetovote_admin: (req, res) => {
    bdd.ChallengeToVote.findAll({
      include: { model: bdd.User, required: false },
    }).then((challenges) => {
      let challengeReturn = challenges.map((c) => {
        c = JSON.parse(JSON.stringify(c));

        c.voteSum = c.Users.reduce((accumulator, current) => {
          return accumulator + current.UserChallengeToVote.vote;
        }, 0);

        c.userVote = c.Users.length;

        delete c.Users;

        return c;
      });

      res.json(challengeReturn);
    });
  },
};
