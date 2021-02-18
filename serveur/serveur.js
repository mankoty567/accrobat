const express = require('express');
const m = require('./modules');

var app = express();

app.use(express.json());

// Challenge
app.get('/api/challenge/:id', m.challenge_ctrl.get_challenge_id);
app.post('/api/challenge', m.challenge_ctrl.post_challenge);
app.delete('/api/challenge/:id', m.challenge_ctrl.delete_challenge);
app.post('/api/challenge/:id', m.challenge_ctrl.update_challenge);
app.get('/api/challenge/:id/image', m.challenge_ctrl.get_image);

// PointPassage
app.get('/api/challenge/:id/point', m.pointpassage_ctrl.get_pointpassage);
app.post('/api/challenge/:id/point', m.pointpassage_ctrl.post_pointpassage);
app.delete('/api/pointpassage/:id', m.pointpassage_ctrl.delete_pointpassage);
app.post('/api/pointpassage/:id', m.pointpassage_ctrl.update_pointpassage);

// Segment
app.post('/api/segment', m.segment_ctrl.post_segment);
app.get('/api/segment/:id', m.segment_ctrl.get_segment);
app.post('/api/segment/:id', m.segment_ctrl.update_segment);
app.delete('/api/segment/:id', m.segment_ctrl.delete_segment);

// Obstacle
app.post('/api/obstacle', m.obstacle_ctrl.post_obstacle);

app.listen(1418, () => console.log('Serveur lancé sur le port 1418'));
