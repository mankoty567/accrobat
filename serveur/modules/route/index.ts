const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bdd = require('../../models');

import { Route } from '../../_types';

const basename = path.basename(__filename);

let associationObj: {
  get: { [key: string]: Route };
  post: { [key: string]: Route };
  delete: { [key: string]: Route };
} = {
  get: {},
  post: {},
  delete: {},
};

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file !== '_type.js' &&
        file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      require('./' + file).routes.forEach((route: Route) => {
        associationObj[route.method.toLowerCase()][route.url] = route;

        app[route.method.toLowerCase()](route.url, [
          checkBody,
          checkUser,
          ...route.func,
        ]);
      });
    });
};

const checkUser = (req, res, next) => {
  let perm: number =
    associationObj[req.method.toLowerCase()][req.route.path].permission;

  if (perm === undefined || perm === -1) {
    next();
  } else {
    let auth = req.headers.authorization;
    if (!auth) {
      res.status(401).send('Must Auth');
    } else {
      let token = auth.split(' ');

      if (token.length !== 2) {
        res.status(401).send('Must Auth');
      } else {
        jwt.verify(token[1], process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            res.status(403).send('Bad request: Token invalide');
          } else {
            if (payload.permission >= perm) {
              bdd.User.findOne({ where: { id: payload.id } }).then((user) => {
                req.user = user;
                next();
              });
            } else {
              res.status(403).send('Forbidden');
            }
          }
        });
      }
    }
  }
};

const checkBody = (req, res, next) => {
  let correctBody =
    associationObj[req.method.toLowerCase()][req.route.path].body;

  if (correctBody === undefined) {
    next();
  } else {
    let correct = checkBodyOfOne(correctBody);

    if (correct.correct) {
      next();
    } else {
      res.status(400).send('Bad request: ' + correct.error_message);
    }
  }

  function checkBodyOfOne(obj) {
    // TODO : Peut-être faire la vérif du type
    let correct = true;
    let error_message = '';

    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === 'object') {
        // Vérification de si c'est un sous objet
        if (obj[k].type === 'object') {
          correct = checkBodyOfOne(obj[k].attributes).correct;
        }

        if (obj[k].required) {
          if (req.body[k] === undefined) {
            correct = false;
            error_message = k + ' est requis';
          }
        }

        // Vérification des valeurs des chaines
        if (obj[k].value !== undefined && req.body[k] !== undefined) {
          correct = obj[k].value.includes(req.body[k]);
        }
      } else {
        if (req.body[k] === undefined) {
          correct = false;
        }
      }
    });

    return { correct, error_message };
  }
};
