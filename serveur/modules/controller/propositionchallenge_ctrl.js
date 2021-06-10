const bdd = require('../../models');

module.exports = {
  add_proposition: (req, res) => {
    bdd.PropositionChallenge.create({
      description: req.body.description,
      status: 'waiting',
      UserId: req.user.id,
    }).then(() => {
      res.send('OK');
    });
  },
  get_proposition: (req, res) => {
    let query = {};

    if (req.query.status === undefined || req.query.status === 'waiting') {
      query = { where: { status: 'waiting' } };
    }

    bdd.PropositionChallenge.findAll(query).then((propositions) => {
      res.json(propositions);
    });
  },
  update_proposition: (req, res) => {
    bdd.PropositionChallenge.findOne({ where: { id: req.params.id } }).then(
      (proposition) => {
        if (proposition === null) {
          res.status(404).send('PropositionChallenge not found');
        } else {
          proposition.status = req.body.status;
          proposition.save().then(() => {
            // Si on accepte la proposition, ça ouvre automatiquement un challengeToVote
            if (req.body.status === 'accepted') {
              bdd.ChallengeToVote.create({
                description: proposition.description,
                status: 'open',
              }).then(() => {
                res.json(proposition);
              });
            } else {
              res.json(proposition);
            }
          });
        }
      }
    );
  },
};
