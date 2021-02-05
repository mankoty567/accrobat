const bdd = require('../../models');

module.exports = {
  get_challenge_id: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
      include: [{ model: bdd.PointPassage }],
    }).then((challenge) => {
      if (challenge !== null) {
        res.json(challenge);
      } else {
        res.status(404).send('Not found');
      }
    });
  },
  post_challenge: (req, res) => {
    if (!req.body.title || !req.body.description || !req.body.img_fond) {
      res.status(400).send('Bad request');
    } else {
      bdd.Challenge.create({
        title: req.body.title,
        description: req.body.description,
        img_fond: req.body.img_fond,
      }).then((challenge) => {
        res.json(challenge);
      });
    }
  },
  delete_challenge: (req, res) => {
    bdd.Challenge.findOne({ where: { id: req.params.id } }).then(
      (challenge) => {
        if (challenge === null) {
          res.status(404).send('Not found');
        } else {
          challenge
            .destroy()
            .then(() => {
              res.send('OK');
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send('Error during delete');
            });
        }
      }
    );
  },
  update_challenge: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
    }).then((challenge) => {
      if (challenge === null) {
        res.status(404).send('Challenge not found');
      } else {
        let edited = false;
        if (req.body.title) {
          challenge.title = req.body.title;
          edited = true;
        }

        if (req.body.description) {
          challenge.description = req.body.description;
          edited = true;
        }

        if (req.body.img_fond) {
          challenge.img_fond = req.body.img_fond;
          edited = true;
        }

        if (edited) {
          challenge.save().then(() => {
            res.json(challenge);
          });
        } else {
          res.json(challenge);
        }
      }
    });
  },
};
