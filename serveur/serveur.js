const express = require('express');

var app = express();

app.get('/', (req, res) => {
  res.send('OUI');
});

app.listen(1418, () => console.log('Serveur lancé sur le port 1418'));
