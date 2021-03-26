const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const package = require('../../package.json');

let categories = [];

function stringifyBody(body, display_required) {
  if (body === undefined) return;

  let newBody = { ...body };

  Object.keys(body).forEach((k) => {
    if (typeof body[k] === 'object') {
      let prefix = '';
      if (display_required && body[k].required) prefix = '*';

      if (body[k].type === 'string') {
        if (body[k].value !== undefined) {
          newBody[prefix + k] = body[k].value.join('/');
        } else {
          newBody[prefix + k] = '';
        }
      }

      if (body[k].type === 'data_url') {
        newBody[prefix + k] = 'data:image/...';
      }

      if (body[k].type === 'number') {
        newBody[prefix + k] = 0;
      }

      if (display_required && body[k].required) delete newBody[k];
    } else {
      if (body[k] === 'string') {
        newBody[k] = '';
      }

      if (body[k] === 'data_url') {
        newBody[k] = 'data:image/...';
      }

      if (body[k] === 'number') {
        newBody[k] = 0;
      }

      if (display_required) {
        newBody['*' + k] = newBody[k];
        delete newBody[k];
      }
    }
  });

  return JSON.stringify(newBody, null, 2);
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
          name: r.name,
          method: r.method,
          url: r.url,
          body: stringifyBody(r.body, true),
          bodyJSON: stringifyBody(r.body, false),
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
  version: package.version,
  categories: categories,
});

/*categories.forEach((cate) => {
  cate.routes.forEach((route) => {
    console.log(route);
  });
});*/

const json = JSON.stringify(
  {
    info: {
      name: 'Acrobatt',
      _postman_id: 'acrobat-documentation',
      version: package.version,
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      {
        key: 'baseURL',
        value: process.env.HOST,
        // eslint-disable-next-line quotes
        name: "Host de l'API",
      },
    ],
    auth: {
      type: 'bearer',
      bearer: [
        {
          key: 'token',
          value: '[VOTRE JWT]',
          type: 'string',
        },
      ],
    },
    item: categories.map((cate) => {
      return {
        name: cate.title,
        item: cate.routes.map((route) => {
          return {
            name: route.name,
            request: {
              description: route.description,
              method: route.method,
              url: {
                raw: '{{baseURL}}' + route.url,
                host: ['{{baseURL}}'],
                path: route.url.split('/').filter((r) => r !== ''),
                variable: route.url
                  .split('/')
                  .filter((r) => r.includes(':'))
                  .map((v) => {
                    return {
                      key: v.substr(1),
                      value: '',
                    };
                  }),
              },
              body: {
                mode: 'raw',
                raw: route.bodyJSON,
                options: {
                  raw: {
                    language: 'json',
                  },
                },
              },
            },
          };
        }),
      };
    }),
  },
  null,
  2
);

// Export du résultat
if (!fs.existsSync(path.join(__dirname, '../../doc'))) {
  fs.mkdirSync(path.join(__dirname, '../../doc'));
}

fs.writeFileSync(path.join(__dirname, '../../doc/index.html'), html);
fs.writeFileSync(path.join(__dirname, '../../doc/collection.json'), json);

// Copie de tous les fichiers statiques
fs.readdirSync(path.join(__dirname, './static')).forEach((file) => {
  fs.copyFileSync(
    path.join(__dirname, './static/', file),
    path.join(__dirname, '../../doc/', file)
  );
});
