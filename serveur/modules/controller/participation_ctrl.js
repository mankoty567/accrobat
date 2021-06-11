const bdd = require('../../models');
const debug = require('debug')('serveur:participation');

module.exports = {
  post_participation: (req, res) => {
    bdd.Challenge.findOne({ where: { id: req.body.ChallengeId } }).then(
      (challenge) => {
        if (challenge === null) {
          res.status(400).send('Bad request: Challenge not found');
        } else if (!challenge.published) {
          res.status(400).send('Bad request: Challenge is not published');
        } else {
          bdd.Participation.create({
            startDate: new Date(),
            UserId: req.user.id,
            ChallengeId: req.body.ChallengeId,
          }).then((participation) => {
            debug('Création participation ' + participation.id);
            res.json(participation);
          });
        }
      }
    );
  },
  get_my_participation: (req, res) => {
    bdd.Participation.findAll({
      where: { UserId: req.user.id },
      attributes: ['id', 'startDate', 'endDate', 'UserId', 'ChallengeId'],
    }).then((participations) => {
      res.json(participations);
    });
  },
  whereiam: (req, res) => {
    bdd.Participation.findOne({ where: { id: req.params.id } }).then(
      (participation) => {
        if (participation.UserId === req.user.id) {
          bdd.Event.findAll({
            where: { ParticipationId: req.params.id },
            order: [['id', 'DESC']],
          }).then((events) => {
            if (events.length === 0) {
              bdd.PointPassage.findOne({
                where: {
                  ChallengeId: participation.ChallengeId,
                  type: 'start',
                },
              }).then((pointPassage) => {
                res.json({
                  segmentsParcourus: [],
                  type: 'PointPassage',
                  entity: JSON.parse(
                    JSON.stringify({
                      ...pointPassage,
                    })
                  ),
                });
              });
            } else {
              // Calcul de l'historique
              let segmentsParcourus = [];

              for (let i = events.length - 1; i >= 0; i--) {
                if (events[i].type === 'pointpassage:depart') {
                  segmentsParcourus.push(Math.trunc(events[i].data));
                }
              }

              let obj = { segmentsParcourus };

              if (events[0].type === 'pointpassage:arrivee') {
                obj.type = 'PointPassage';
                bdd.PointPassage.findOne({
                  where: { id: Math.trunc(events[0].data) },
                }).then((pointpassage) => {
                  obj.entity = JSON.parse(JSON.stringify({ ...pointpassage }));
                  res.json(obj);
                });
              } else if (events[0].type === 'obstacle:arrivee') {
                obj.type = 'Obstacle';
                bdd.Obstacle.findOne({
                  where: { id: Math.trunc(events[0].data) },
                  attributes: [
                    'id',
                    'title',
                    'description',
                    'type',
                    'distance',
                  ],
                }).then((obstacle) => {
                  obj.entity = JSON.parse(JSON.stringify({ ...obstacle }));
                  obj.submitedImg = undefined;
                  res.json(obj);
                });
              } else if (events[0].type === 'obstacle:image') {
                obj.type = 'Obstacle';
                bdd.Obstacle.findOne({
                  where: { id: Math.trunc(events[1].data) },
                  attributes: [
                    'id',
                    'title',
                    'description',
                    'type',
                    'distance',
                  ],
                }).then((obstacle) => {
                  bdd.ImageSubmition.findOne({
                    where: { EventId: events[0].id },
                    attributes: ['createdAt', 'updatedAt', 'ok'],
                  }).then((img) => {
                    obj.entity = JSON.parse(JSON.stringify({ ...obstacle }));
                    obj.submitedImg = img;
                    res.json(obj);
                  });
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

                bdd.Segment.findOne({ where: { id: segmentId } }).then(
                  (segment) => {
                    obj.type = 'Segment';
                    obj.distance = distance;
                    obj.entity = JSON.parse(JSON.stringify({ ...segment }));
                    res.json(obj);
                  }
                );
              }
            }
          });
        } else {
          res.status(403).send('Participation is not to logged user');
        }
      }
    );
  },
  get_session: (req, res) => {
    bdd.Participation.findOne({ where: { id: req.params.id } }).then(
      (participation) => {
        if (participation.UserId === req.user.id) {
          bdd.Event.findAll({
            where: { ParticipationId: req.params.id },
            order: [['id', 'DESC']],
          }).then((events) => {
            res.json(events);
          });
        } else {
          res.status(403).send('Participation is not to logged user');
        }
      }
    );
  },
};
