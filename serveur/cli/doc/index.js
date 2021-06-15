"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var fs = require('fs');
var path = require('path');
var mustache = require('mustache');
var packageJson = require('../../package.json');
var chalk = require('chalk');
var sequelizeErd = require('sequelize-erd');
var bdd = require('../../models');
var categories = [];
function stringifyBody(body, display_required) {
    if (body === undefined)
        return;
    var newBody = convertObj(body);
    function convertObj(obj) {
        var newObj = __assign({}, obj);
        Object.keys(obj).forEach(function (k) {
            if (typeof obj[k] === 'object') {
                var prefix = '';
                if (display_required && obj[k].required)
                    prefix = '*';
                if (obj[k].type === 'string') {
                    if (obj[k].value !== undefined) {
                        newObj[prefix + k] = obj[k].value.join('/');
                    }
                    else {
                        newObj[prefix + k] = '';
                    }
                }
                else if (obj[k].type === 'data_url') {
                    newObj[prefix + k] = 'data:image/...';
                }
                else if (obj[k].type === 'number') {
                    newObj[prefix + k] = 0;
                }
                else if (obj[k].type === 'boolean') {
                    newObj[prefix + k] = 'true/false';
                }
                else if (obj[k].type === 'object') {
                    newObj[prefix + k] = convertObj(obj[k].attributes);
                }
                else {
                    newObj[prefix + k] = obj[k].type;
                }
                if (display_required && obj[k].required)
                    delete newObj[k];
            }
            else {
                if (obj[k] === 'string') {
                    newObj[k] = '';
                }
                else if (obj[k] === 'data_url') {
                    newObj[k] = 'data:image/...';
                }
                else if (obj[k] === 'number') {
                    newObj[k] = 0;
                }
                else if (obj[k] === 'boolean') {
                    newObj[k] = 'true/false';
                }
                else {
                    newObj[k] = obj[k];
                }
                if (display_required) {
                    newObj['*' + k] = newObj[k];
                    delete newObj[k];
                }
            }
        });
        return newObj;
    }
    return JSON.stringify(newBody, null, 2);
}
function stringifyResult(result) {
    return JSON.stringify(result, null, 2);
}
var permissionTab = {
    '-1': {
        color: '#34495E',
        backColor: '#F7F9F9',
        string: 'Libre',
        description: 'Pas de connexion nécéssaire',
    },
    '0': {
        color: '#F4F6F7',
        backColor: '#3498DB',
        string: 'Connecté',
        description: 'Connexion obligatoire mais sans permissions',
    },
    '100': {
        color: '#F4F6F7',
        backColor: '#229954',
        string: 'Créateur',
        description: 'Connexion obligatoire avec au moins un rôle de créateur',
    },
    '1000': {
        color: '#F4F6F7',
        backColor: '#8E44AD',
        string: 'Administrateur',
        description: "Connexion obligatoire avec au moins un rôle d'administrateur",
    },
};
fs.readdirSync(path.join(__dirname, '../../modules/route'))
    .filter(function (file) {
    return (file.indexOf('.') !== 0 &&
        file !== 'index.js' &&
        file !== '_types.js' &&
        file.slice(-3) === '.js');
})
    .forEach(function (file) {
    var data = require(path.join(__dirname, '../../modules/route/', file));
    categories.push({
        title: data.meta.title,
        routes: data.routes.map(function (r) {
            var _a, _b;
            return {
                name: r.name,
                method: r.method,
                url: r.url,
                body: stringifyBody(r.body, true),
                bodyJSON: stringifyBody(r.body, false),
                query: r.query,
                description: r.description,
                test: (_a = r.test) !== null && _a !== void 0 ? _a : false,
                permission: r.permission,
                permissionStr: permissionTab['' + r.permission].string,
                permissionBackColor: permissionTab['' + r.permission].backColor,
                permissionColor: permissionTab['' + r.permission].color,
                result: (_b = r.result) === null || _b === void 0 ? void 0 : _b.map(function (resu) {
                    return {
                        code: resu.code,
                        content: stringifyResult(resu.content),
                    };
                }),
            };
        }),
    });
});
var template = fs.readFileSync(path.join(__dirname, './template.mustache'), 'utf-8');
var permissionKey = Object.keys(permissionTab);
var html = mustache.render(template, {
    doc_name: process.env.DOC_NAME,
    last_build_date: new Date(),
    version: packageJson.version,
    categories: categories,
    permissions: permissionKey.map(function (key) {
        return __assign(__assign({}, permissionTab[key]), { number: key });
    }),
});
var json = JSON.stringify({
    info: {
        name: process.env.DOC_NAME || 'Documentation',
        _postman_id: (process.env.DOC_NAME || 'undefined') + "-documentation",
        version: packageJson.version,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
        {
            key: 'baseURL',
            value: process.env.DOC_HOST,
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
    item: categories.map(function (cate) {
        return {
            name: cate.title,
            item: cate.routes.map(function (route) {
                return {
                    name: route.name,
                    request: {
                        description: route.description,
                        method: route.method,
                        url: {
                            raw: '{{baseURL}}' + route.url,
                            host: ['{{baseURL}}'],
                            path: route.url.split('/').filter(function (r) { return r !== ''; }),
                            variable: route.url
                                .split('/')
                                .filter(function (r) { return r.includes(':'); })
                                .map(function (v) {
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
}, null, 2);
// Export du résultat
if (!fs.existsSync(path.join(__dirname, '../../doc'))) {
    fs.mkdirSync(path.join(__dirname, '../../doc'));
}
fs.writeFileSync(path.join(__dirname, '../../doc/index.html'), html);
fs.writeFileSync(path.join(__dirname, '../../doc/collection.json'), json);
// Copie de tous les fichiers statiques
fs.readdirSync(path.join(__dirname, './static')).forEach(function (file) {
    fs.copyFileSync(path.join(__dirname, './static/', file), path.join(__dirname, '../../doc/', file));
});
// Génération du modèle de la BDD
sequelizeErd({ source: bdd.sequelize }).then(function (svg) {
    fs.writeFileSync(path.join(__dirname, '../../doc/bdd.svg'), svg);
    console.log(chalk.bold.green('Documentation générée!'));
    process.exit();
});
