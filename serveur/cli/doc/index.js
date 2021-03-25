const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

let categories = [];

function stringifyBody(body) {
  // Ajouter les suppressions de types et tout
  return JSON.stringify(body, null, 2);
}

function stringifyResult(result) {
  return JSON.stringify(result, null, 2);
}

fs.readdirSync(path.join(__dirname, '../../modules/route'))
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    let data = require(path.join(__dirname, '../../modules/route/', file));
    categories.push({
      title: data.meta.title,
      routes: data.routes.map((r) => {
        return {
          method: r.method,
          url: r.url,
          body: stringifyBody(r.body),
          description: r.description,
          result: r.result?.map((resu) => {
            return {
              code: resu.code,
              content: stringifyResult(resu.content),
            };
          }),
        };
      }),
    });
  });

console.log(categories);

const template = fs.readFileSync(
  path.join(__dirname, './template.mustache'),
  'utf-8'
);

const html = mustache.render(template, {
  last_build_date: new Date(),
  version: require('../../package.json').version,
  categories: categories,
});

// Export du résultat
if (!fs.existsSync(path.join(__dirname, '../../doc'))) {
  fs.mkdirSync(path.join(__dirname, '../../doc'));
}

fs.writeFileSync(path.join(__dirname, '../../doc/index.html'), html);

// Copie de tous les fichiers statiques
fs.readdirSync(path.join(__dirname, './static')).forEach((file) => {
  fs.copyFileSync(
    path.join(__dirname, './static/', file),
    path.join(__dirname, '../../doc/', file)
  );
});
