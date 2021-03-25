const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

let associationObj = { get: {}, post: {}, delete: {} };

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      require('./' + file).routes.forEach((route) => {
        associationObj[route.method.toLowerCase()][route.url] = route;
        app[route.method.toLowerCase()](route.url, [checkBody, ...route.func]);
      });
    });
};

const checkBody = (req, res, next) => {
  let correctBody =
    associationObj[req.method.toLowerCase()][req.route.path].body;

  if (correctBody === undefined) {
    next();
  } else {
    let correct = true;

    // TODO : Peut-être faire la vérif du type
    Object.keys(correctBody).forEach((k) => {
      if (typeof correctBody[k] === 'object') {
        if (correctBody[k].required) {
          if (req.body[k] === undefined) {
            correct = false;
          }
        }
      } else {
        if (req.body[k] === undefined) {
          correct = false;
        }
      }
    });

    if (correct) {
      next();
    } else {
      res.status(400).send('Bad request');
    }
  }
};
