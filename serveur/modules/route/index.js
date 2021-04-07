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
    let correct = checkBodyOfOne(correctBody);

    if (correct) {
      next();
    } else {
      res.status(400).send('Bad request');
    }
  }

  function checkBodyOfOne(obj) {
    // TODO : Peut-être faire la vérif du type
    let correct = true;

    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === 'object') {
        // Vérification de si c'est un sous objet
        if (obj[k].type === 'object') {
          correct = checkBodyOfOne(obj[k].attributes);
        }

        if (obj[k].required) {
          if (req.body[k] === undefined) {
            correct = false;
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

    return correct;
  }
};
