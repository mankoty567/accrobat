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
};
