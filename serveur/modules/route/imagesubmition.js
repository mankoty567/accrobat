/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Challenge',
};

module.exports.routes = [
  {
    method: 'GET',
    url: '/api/imagesubmition/:id/image',
    func: [m.imagesubmition_ctrl.get_image],
    name: "Récupération d'une image soumise",
    description:
      "Renvoit l'image associée à un challenge sous la forme d'un simple fichier",
  },
  {
    method: 'POST',
    url: '/api/imagesubmition',
    func: [m.user_mdw.put_user, m.imagesubmition_ctrl.post_image],
    name: "Soumission d'une image",
    description: 'Soumet une image à un Obstacle de type action',
    body: {
      ParticipationId: 'number',
      img_data: 'data_url',
    },
    result: [
      { code: 400, content: 'Bad request: Participation not found' },
      { code: 400, content: 'Bad request: Not in an obstacle' },
      { code: 400, content: 'Bad request: Obstacle is not an action' },
    ],
  },
];
