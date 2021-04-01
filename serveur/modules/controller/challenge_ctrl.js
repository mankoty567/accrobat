const bdd = require('../../models');
const debug = require('debug')('serveur:challenge');

module.exports = {
  get_challenge_id: (req, res) => {
    let query = {
      where: { id: req.params.id },
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
    };

    if (req.query.include === 'point') {
      query.include = [{ model: bdd.PointPassage }];
    } else if (req.query.include === 'pointsegment') {
      query.include = [
        {
          model: bdd.PointPassage,
          include: [
            {
              model: bdd.Segment,
              as: 'pointStart',
            },
            {
              model: bdd.Segment,
              as: 'pointEnd',
            },
          ],
        },
      ];
    }
    bdd.Challenge.findOne(query).then((challenge) => {
      if (challenge !== null) {
        res.json(challenge);
      } else {
        res.status(404).send('Not found');
      }
    });
  },
  get_image: (req, res) => {
    bdd.Challenge.findOne({
      where: { id: req.params.id },
    }).then((challenge) => {
      if (challenge === null) {
        res.status(404).send('Not found');
      } else {
        let img = new Buffer.from(
          challenge.img_fond.replace(/^.*base64,/, ''),
          'base64'
        );
        var mime = challenge.img_fond.match(
          /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
        )[1];

        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': img.length,
        });
        res.end(img);
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
        debug('Création du challenge ' + challenge.id);
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
          debug('Suppression du challenge ' + challenge.id);
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
          debug('Mise à jour du challenge ' + challenge.id);
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
