const express = require('express');
const cors = require('cors');
const debug = require('debug')('serveur:main');
const m = require('./modules');

m.utils.check_folder();

var app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use('/doc', express.static('./doc'));

app.use(m.utils.debugger);

require('./modules/route')(app);

app.get('/', (req, res) => res.send(require('./package.json').version));

const server = app.listen(1418, () => debug('Serveur lancé sur le port 1418'));

module.exports = { app, server };
