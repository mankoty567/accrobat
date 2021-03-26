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

// Event
app.post('/api/event', m.user_mdw.put_user, m.event_ctrl.post_event);
app.get(
  '/api/participation/:id/whereiam',
  m.user_mdw.put_user,
  m.event_ctrl.whereiam
);

app.listen(1418, () => debug('Serveur lancé sur le port 1418'));
