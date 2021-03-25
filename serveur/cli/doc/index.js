const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

let categories = [];

function stringifyBody(body) {
  // Ajouter les suppressions de types et tout
  if (body === undefined) return;

  Object.keys(body).forEach((k) => {
    if (typeof body[k] === 'object') {
      let prefix = '';
      if (body[k].required) prefix = '*';

      if (body[k].type === 'string') {
        body[prefix + k] = '';
      }

      if (body[k].type === 'data_url') {
        body[prefix + k] = 'data:image/...';
      }

      if (body[k].type === 'number') {
        body[prefix + k] = 0;
      }

      if (body[k.required]) delete body[k];
    } else {
      if (body[k] === 'string') {
        body[k] = '';
      }

      if (body[k] === 'data_url') {
        body[k] = 'data:image/...';
      }

      if (body[k] === 'number') {
        body[k] = 0;
      }

      body['*' + k] = body[k];
      delete body[k];
    }
  });
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
          query: r.query,
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
