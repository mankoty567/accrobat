const bdd = require('../../models');

const ALLOWED_TYPE = [
  'marche',
  'course',
  'velo',
  'pointpassage:arrivee',
  'pointpassage:depart',
  'obstacle:arrivee',
  'obstacle:image',
  'obstacle:image_ok',
  'obstacle:completed',
];
const REQUIRED_DATA = [
  true,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  false,
];

module.exports = {
  post_event: (req, res) => {
    if (!req.body.type || req.body.ParticipationId === undefined) {
      res.status(400).send('Bad request');
    } else {
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
            }
          });
          bdd.Event.create({
            ParticipationId: req.body.ParticipationId,
            type: req.body.type,
            data: req.body.data !== undefined ? req.body.data : null,
          }).then((event) => {
            res.json(event);
          });
        }
      }
    }
  },
  whereiam: (req, res) => {
    bdd.Event.findAll({
      where: { ParticipationId: req.params.id },
      order: [['id', 'DESC']],
    }).then((events) => {
      // Calcul de l'historique
      let segmentsParcourus = [];

      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].type === 'pointpassage:depart') {
          segmentsParcourus.push(Math.trunc(events[i].data));
        }
      }

      let obj = { segmentsParcourus };

      // TODO : Ajouter la gestion des obstacles
      if (events[0].type === 'pointpassage:arrivee') {
        obj.type = 'PointPassage';
        bdd.PointPassage.findOne({
          where: { id: Math.trunc(events[0].data) },
        }).then((pointpassage) => {
          obj.entity = pointpassage;
          res.json(obj);
        });
      } else {
        let distance = 0;
        let isOnPoint = false;
        let i = 0;
        let segmentId = undefined;

        while (!isOnPoint) {
          if (events[i].type === 'pointpassage:depart') {
            isOnPoint = true;
            segmentId = Math.trunc(events[i].data);
          } else {
            distance = distance + events[i].data;
            i++;
          }
        }

        bdd.Segment.findOne({ where: { id: segmentId } }).then((segment) => {
          obj.type = 'Segment';
          obj.distance = distance;
          obj.entity = segment;
          res.json(obj);
        });
      }
    });
  },
};
