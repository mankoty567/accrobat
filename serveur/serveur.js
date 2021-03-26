const express = require('express');
const cors = require('cors');
const debug = require('debug')('serveur:main');
const m = require('./modules');

m.utils.check_folder();

var app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use('/doc', express.static('./doc'));
require('./modules/route')(app);

app.get('/', (req, res) => res.send(require('./package.json').version));

// Obstacle
app.post('/api/obstacle', m.user_mdw.put_admin, m.obstacle_ctrl.post_obstacle);
app.post(
  '/api/obstacle/awnser',
  m.user_mdw.put_user,
  m.obstacle_ctrl.awnser_obstacle
);
app.get('/api/obstacle/:id/image', m.obstacle_ctrl.get_image);
app.post(
  '/api/obstacle/:id',
  m.user_mdw.put_admin,
  m.obstacle_ctrl.update_obstacle
);
app.delete(
  '/api/obstacle/:id',
  m.user_mdw.put_admin,
  m.obstacle_ctrl.delete_obstacle
);

// Image Submition
app.get('/api/imagesubmition/:id/image', m.imagesubmition_ctrl.get_image);
app.post(
  '/api/imagesubmition',
  m.user_mdw.put_user,
  m.imagesubmition_ctrl.post_image
);
app.get(
  '/api/imagesubmition',
  m.user_mdw.put_admin,
  m.imagesubmition_ctrl.get_all_soumission
);
app.post(
  '/api/imagesubmition/:id/judge',
  m.user_mdw.put_admin,
  m.imagesubmition_ctrl.juge_soumission
);

// Participation
app.post(
  '/api/participation',
  m.user_mdw.put_user,
  m.participation_ctrl.post_participation
);
app.get(
  '/api/participation',
  m.user_mdw.put_user,
  m.participation_ctrl.get_my_participation
);

// Utilisateur
app.post('/api/user/register', m.user_ctrl.create_user);
app.post('/api/user/login', m.user_ctrl.login);
app.get('/api/user/whoami', m.user_ctrl.whoami);

// Event
app.post('/api/event', m.user_mdw.put_user, m.event_ctrl.post_event);
app.get(
  '/api/participation/:id/whereiam',
  m.user_mdw.put_user,
  m.event_ctrl.whereiam
);

app.listen(1418, () => debug('Serveur lancé sur le port 1418'));
