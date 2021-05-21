const bdd = require('../../models');
const jwt = require('jsonwebtoken');

module.exports = {
  put_user: (req, res, next) => {
    // if (process.env.NODE_ENV === 'development') {
    //   bdd.User.findOne({ where: { id: 1 } }).then((user) => {
    //     req.user = user;
    //     next();
    //   });
    // } else {
    let auth = req.headers.authorization;
    if (!auth) {
      res.status(400).send('Bad request');
    } else {
      let token = auth.split(' ');

      if (token.length !== 2) {
        res.status(400).send('Bad request');
      } else {
        jwt.verify(token[1], process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            res.status(403).send('Bad request: Token invalide');
          } else {
            bdd.User.findOne({ where: { id: payload.id } }).then((user) => {
              req.user = user;
              next();
            });
          }
        });
      }
      // }
    }
  },
  put_admin: (req, res, next) => {
    // if (process.env.NODE_ENV === 'development') {
    //   bdd.User.findOne({ where: { id: 1 } }).then((user) => {
    //     req.user = user;
    //     next();
    //   });
    // } else {
    let auth = req.headers.authorization;
    if (!auth) {
      res.status(400).send('Bad request');
    } else {
      let token = auth.split(' ');

      if (token.length !== 2) {
        res.status(400).send('Bad request');
      } else {
        jwt.verify(token[1], process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            res.status(403).send('Bad request: Token invalide');
          } else {
            if (payload.permission >= 100) {
              bdd.User.findOne({ where: { id: payload.id } }).then((user) => {
                req.user = user;
                next();
              });
            } else {
              res.status(403).send('Bad Request: Not Admin');
            }
          }
        });
      }
    }
    // }
  },
};
