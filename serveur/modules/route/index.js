const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

let associationObj = {};

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach((file) => {
      require('./' + file).routes.forEach((route) => {
        associationObj[route.url] = route;
        app[route.method.toLowerCase()](route.url, route.func);
      });
    });
};
