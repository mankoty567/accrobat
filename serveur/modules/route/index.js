"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var bdd = require('../../models');
var basename = path.basename(__filename);
var associationObj = {
    get: {},
    post: {},
    delete: {},
};
module.exports = function (app) {
    fs.readdirSync(__dirname)
        .filter(function (file) {
        return (file.indexOf('.') !== 0 &&
            file !== basename &&
            file !== '_type.js' &&
            file.slice(-3) === '.js');
    })
        .forEach(function (file) {
        require('./' + file).routes.forEach(function (route) {
            associationObj[route.method.toLowerCase()][route.url] = route;
            app[route.method.toLowerCase()](route.url, __spreadArray([
                checkBody,
                checkUser
            ], route.func));
        });
    });
};
var checkUser = function (req, res, next) {
    var perm = associationObj[req.method.toLowerCase()][req.route.path].permission;
    if (perm === undefined || perm === -1) {
        next();
    }
    else {
        var auth = req.headers.authorization;
        if (!auth) {
            res.status(401).send('Must Auth');
        }
        else {
            var token = auth.split(' ');
            if (token.length !== 2) {
                res.status(401).send('Must Auth');
            }
            else {
                jwt.verify(token[1], process.env.JWT_SECRET, function (err, payload) {
                    if (err) {
                        res.status(403).send('Bad request: Token invalide');
                    }
                    else {
                        if (payload.permission >= perm) {
                            bdd.User.findOne({ where: { id: payload.id } }).then(function (user) {
                                req.user = user;
                                next();
                            });
                        }
                        else {
                            res.status(403).send('Forbidden');
                        }
                    }
                });
            }
        }
    }
};
var checkBody = function (req, res, next) {
    var correctBody = associationObj[req.method.toLowerCase()][req.route.path].body;
    if (correctBody === undefined) {
        next();
    }
    else {
        var correct = checkBodyOfOne(correctBody);
        if (correct.correct) {
            next();
        }
        else {
            res.status(400).send('Bad request: ' + correct.error_message);
        }
    }
    function checkBodyOfOne(obj) {
        // TODO : Peut-être faire la vérif du type
        var correct = true;
        var error_message = '';
        Object.keys(obj).forEach(function (k) {
            if (typeof obj[k] === 'object') {
                // Vérification de si c'est un sous objet
                if (obj[k].type === 'object') {
                    correct = checkBodyOfOne(obj[k].attributes).correct;
                }
                if (obj[k].required) {
                    if (req.body[k] === undefined) {
                        correct = false;
                        error_message = k + ' est requis';
                    }
                }
                // Vérification des valeurs des chaines
                if (obj[k].value !== undefined && req.body[k] !== undefined) {
                    correct = obj[k].value.includes(req.body[k]);
                }
            }
            else {
                if (req.body[k] === undefined) {
                    correct = false;
                }
            }
        });
        return { correct: correct, error_message: error_message };
    }
};
