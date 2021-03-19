const express = require('express');
const cors = require('cors');
const debug = require('debug')('serveur:main');
const m = require('./modules');

m.utils.check_folder();

var app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send(require('./package.json').version));

// Challenge
app.get('/api/challenge/:id', m.challenge_ctrl.get_challenge_id);
app.get('/api/challenge', m.challenge_ctrl.get_all_challenge);
app.get('/api/challenge/admin', m.challenge_ctrl.get_all_challenge_admin);
app.post('/api/challenge', m.challenge_ctrl.post_challenge);
app.delete('/api/challenge/:id', m.challenge_ctrl.delete_challenge);
app.post('/api/challenge/:id', m.challenge_ctrl.update_challenge);
app.get('/api/challenge/:id/image', m.challenge_ctrl.get_image);
app.post('/api/challenge/:id/clone', m.challenge_ctrl.clone_challenge);
app.get('/api/challenge/:id/validity', m.challenge_ctrl.verif_validity);
app.post('/api/challenge/:id/publish', m.challenge_ctrl.publish_challenge);

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
app.post('/api/obstacle/awnser', m.obstacle_ctrl.awnser_obstacle);
app.get('/api/obstacle/:id/image', m.obstacle_ctrl.get_image);
app.post('/api/obstacle/:id', m.obstacle_ctrl.update_obstacle);
app.delete('/api/obstacle/:id', m.obstacle_ctrl.delete_obstacle);

// Image Submition
app.get('/api/imagesubmition/:id/image', m.imagesubmition_ctrl.get_image);
app.post('/api/imagesubmition', m.imagesubmition_ctrl.post_image);
app.get('/api/imagesubmition', m.imagesubmition_ctrl.get_all_soumission);
app.post(
  '/api/imagesubmition/:id/judge',
  m.imagesubmition_ctrl.juge_soumission
);

// Participation
app.post('/api/participation', m.participation_ctrl.post_participation);
app.get('/api/participation', m.participation_ctrl.get_my_participation);

// Event
app.post('/api/event', m.event_ctrl.post_event);
app.get('/api/participation/:id/whereiam', m.event_ctrl.whereiam);

app.listen(1418, () => debug('Serveur lancé sur le port 1418'));
