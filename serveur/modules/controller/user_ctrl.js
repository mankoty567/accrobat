const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bdd = require('../../models');

module.exports = {
  create_user: (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 12);
    bdd.User.findOne({ where: { username: req.body.username } }).then(
      (userWithUsername) => {
        if (userWithUsername !== null) {
          res.status(400).send('Username is already taken');
        } else {
          bdd.User.create({
            username: req.body.username,
            password: hash,
            email: req.body.email,
            permission: 0,
            level: 0,
            xp: 0,
          }).then(() => {
            res.send('OK');
          });
        }
      }
    );
  },
  login: (req, res) => {
    bdd.User.findOne({ where: { username: req.body.username } }).then(
      (user) => {
        if (user === null) {
          res.status(403).send('Bad username or password');
        } else {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign(
              {
                id: user.id,
                permission: user.permission,
              },
              process.env.JWT_SECRET,
              { expiresIn: '3h' }
            );

            res.json({
              id: user.id,
              username: user.username,
              email: user.email,
              permission: user.permission,
              level: user.level,
              xp: user.xp,
              jwt: token,
            });
          } else {
            res.status(403).send('Bad username or password');
          }
        }
      }
    );
  },
  whoami: (req, res) => {
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
            res.status(400).send('Bad request: Token invalide');
          } else {
            bdd.User.findOne({ where: { id: payload.id } }).then((user) => {
              if (user === null) {
                res.status(400).send('Bad request: User not found');
              } else {
                let token = jwt.sign(
                  {
                    id: user.id,
                    permission: user.permission,
                  },
                  process.env.JWT_SECRET,
                  { expiresIn: '3h' }
                );

                res.json({
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  permission: user.permission,
                  level: user.level,
                  xp: user.xp,
                  jwt: token,
                });
              }
            });
          }
        });
      }
    }
  },
};
