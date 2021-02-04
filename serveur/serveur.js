const express = require('express');
const m = require('./modules');

var app = express();

app.use(express.json());

// Challenge
app.get('/api/challenge/:id', m.challenge_ctrl.get_challenge_id);
app.post('/api/challenge', m.challenge_ctrl.post_challenge);

// PointPassage
app.get('/api/challenge/:id/point', m.pointpassage_ctrl.get_pointpassage);
app.post('/api/challenge/:id/point', m.pointpassage_ctrl.post_pointpassage);

// Segment
app.post('/api/segment', m.segment_ctrl.post_segment);

app.listen(1418, () => console.log('Serveur lancé sur le port 1418'));
