const bdd = require('../../models');
const debug = require('debug')('serveur:event');

const ALLOWED_TYPE = [
  'marche',
  'course',
  'velo',
  'pointpassage:arrivee',
  'pointpassage:depart',
  'obstacle:arrivee',
  //'obstacle:image',
  //'obstacle:image_ok',
  //'obstacle:completed',
];
const REQUIRED_DATA = [
  true,
  true,
  true,
  true,
  true,
  true,
  //true,
  //false,
  //false,
];

module.exports = {
  post_event: (req, res) => {
    // Verification de si le type est bon
    let index = ALLOWED_TYPE.indexOf(req.body.type);
    if (index === -1) {
      res.status(400).send('Bad type');
    } else {
      // Verification de si les données sont nécéssaires
      if (REQUIRED_DATA[index] && req.body.data === undefined) {
        res.status(400).send('Bad request: No data');
      } else {
        bdd.Participation.findOne({
          where: { id: req.body.ParticipationId },
        }).then((participation) => {
          if (participation === null) {
            res.status(400).send('Bad request: Participation not found');
          } else {
            if (participation.UserId === req.user.id) {
              // Si c'est une arrivée à un point de passage, on vérifie si c'est pas le dernier
              if (req.body.type === 'pointpassage:arrivee') {
                bdd.PointPassage.findOne({
                  where: { id: Math.trunc(req.body.data) },
                }).then((pp) => {
                  if (pp === null) {
                    res.status(400).send('Point not found');
                  } else {
                    if (pp.type === 'end') {
                      participation.endDate = new Date();

                      participation.save().then(() => {
                        createEvent(req, res);
                      });
                    } else {
                      createEvent(req, res);
                    }
                  }
                });
              } else {
                createEvent(req, res);
              }
            } else {
              res.status(403).send('Participation is not to logged user');
            }
          }
        });
      }
    }
  },
};

function createEvent(req, res) {
  bdd.Event.create({
    ParticipationId: req.body.ParticipationId,
    type: req.body.type,
    data: req.body.data !== undefined ? req.body.data : null,
  }).then((event) => {
    // eslint-disable-next-line quotes
    debug("Création de l'event " + event.id);
    res.json(event);
  });
}
