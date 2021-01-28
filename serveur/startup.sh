#!/bin/bash
npx sequelize-cli db:migrate --config ./models/config.js 

node serveur.js