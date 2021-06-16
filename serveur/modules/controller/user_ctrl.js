const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const fs = require('fs');
const path = require('path');

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
          }).then((user) => {
            if (req.body.avatar !== undefined) {
              utils.parseAvatar(req.body.avatar).then((buffer) => {
                fs.writeFileSync(
                  path.join(__dirname, '../../data/user/' + user.id + '.webp'),
                  buffer
                );
              });
            }

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
          if (user.password === null) {
            res.status(403).send('Bad username or password');
            return;
          }

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
                let newToken = jwt.sign(
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
                  jwt: newToken,
                });
              }
            });
          }
        });
      }
    }
  },
  edit_user: async (req, res) => {
    let edited = false;

    if (req.body.username !== undefined) {
      let otherUserWithUsername = await bdd.User.findOne({
        where: { username: req.body.username },
      });

      if (otherUserWithUsername === null) {
        req.user.username = req.body.username;
        edited = true;
      } else {
        res.status(400).send('Bad Request: Username already exist');
        return;
      }
    }

    if (req.body.email !== undefined) {
      req.user.email = req.body.email;
      edited = true;
    }

    if (req.body.avatar !== undefined) {
      utils.parseAvatar(req.body.avatar).then((buffer) => {
        fs.writeFileSync(
          path.join(__dirname, '../../data/user/' + req.user.id + '.webp'),
          buffer
        );
      });
    }

    if (edited) {
      await req.user.save();

      let user = JSON.parse(JSON.stringify(req.user));

      delete user.password;

      res.json(user);
    } else {
      let user = JSON.parse(JSON.stringify(req.user));

      delete user.password;

      res.json(user);
    }
  },
  edit_user_password: (req, res) => {
    if (req.body.new_password !== req.body.repeat_password) {
      res.status(400).send('Two password not match');
    } else {
      if (bcrypt.compareSync(req.body.old_password, req.user.password)) {
        let hash = bcrypt.hashSync(req.body.new_password, 12);

        req.user.password = hash;
        req.user.save().then(() => {
          res.send('OK');
        });
      } else {
        res.status(403).send('Old Password Not Correct');
      }
    }
  },
  get_avatar: (req, res) => {
    if (
      fs.existsSync(
        path.join(__dirname, '../../data/user/' + req.params.id + '.webp')
      )
    ) {
      res.sendFile(
        path.join(__dirname, '../../data/user/' + req.params.id + '.webp')
      );
    } else {
      res.status(404).send('Not found');
    }
  },
  check_username: async (req, res) => {
    let otherUserWithUsername = await bdd.User.findOne({
      where: { username: req.params.username },
    });

    res.json({ valid: otherUserWithUsername === null });
  },
  get_all_user: (req, res) => {
    bdd.User.findAll({
      attributes: ['id', 'username'],
    }).then((users) => {
      res.json(users);
    });
  },
  get_all_user_with_roles: (req, res) => {
    bdd.User.findAll({
      attributes: ['id', 'username', 'permission'],
    }).then((users) => {
      res.json(users);
    });
  },
  update_user_permission: (req, res) => {
    if (req.params.id === req.user.id) {
      res.status(400).send('Cannot modify yourself');
    } else {
      bdd.User.findOne({ where: { id: req.params.id } }).then((user) => {
        user.permission = req.body.permission;

        user.save().then(() => {
          res.send('OK');
        });
      });
    }
  },
};
