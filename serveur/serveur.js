const express = require('express');
const m = require('./modules');

var app = express();

app.use(express.json());

// Challenge
app.get('/api/challenge/:id', m.challenge_ctrl.get_challenge_id);
app.post('/api/challenge', m.challenge_ctrl.post_challenge);
app.delete('/api/challenge/:id', m.challenge_ctrl.delete_challenge);
app.post('/api/challenge/:id', m.challenge_ctrl.update_challenge);

// PointPassage
app.get('/api/challenge/:id/point', m.pointpassage_ctrl.get_pointpassage);
app.post('/api/challenge/:id/point', m.pointpassage_ctrl.post_pointpassage);
app.delete('/api/pointpassage/:id', m.pointpassage_ctrl.delete_pointpassage);
app.post('/api/pointpassage/:id', m.pointpassage_ctrl.update_pointpassage);

// Segment
app.post('/api/segment', m.segment_ctrl.post_segment);

// ChallengeCurrent
app.get(
  '/api/challengecurrent/get_all',
  m.user_mdw.put_user,
  m.challengecurrent_ctrl.get_all_challengecurrent
);
app.get(
  '/api/challengecurrent/:id',
  m.challengecurrent_ctrl.get_one_challengecurrent
);

app.listen(1418, () => console.log('Serveur lancé sur le port 1418'));
