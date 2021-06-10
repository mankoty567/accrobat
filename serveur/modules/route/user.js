"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'User',
};
var routes = [
    {
        method: 'POST',
        url: '/api/user/register',
        func: [m.user_ctrl.create_user],
        permission: -1,
        name: "Inscription d'un utilisateur",
        description: 'Crée un nouvel utilisateur à partir des paramètres envoyés',
        test: true,
        body: {
            username: 'string',
            password: 'string',
            email: 'string',
            avatar: {
                type: 'data_url',
                required: false,
            },
        },
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Username is already taken' },
        ],
    },
    {
        method: 'POST',
        url: '/api/user/login',
        func: [m.user_ctrl.login],
        permission: -1,
        name: 'Connection',
        description: "Demande la connection d'un utilisateur",
        test: true,
        body: {
            username: 'string',
            password: 'string',
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    username: '',
                    email: '',
                    permission: 0,
                    level: 0,
                    xp: 0,
                    jwt: 'jwt',
                },
            },
            { code: 403, content: 'Bad username or password' },
        ],
    },
    {
        method: 'GET',
        url: '/api/user/whoami',
        func: [m.user_ctrl.whoami],
        permission: -1,
        name: 'Qui suis-je?',
        description: "Vérifie si le JWT est encore valide, si oui le rafraichie et renvoit les données de l'utilisateur, sinon 403",
        test: true,
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    username: '',
                    email: '',
                    permission: 0,
                    level: 0,
                    xp: 0,
                    jwt: 'jwt',
                },
            },
            { code: 400, content: 'Bad request: Token invalide' },
        ],
    },
    {
        method: 'POST',
        url: '/api/user/edit',
        func: [m.user_ctrl.edit_user],
        permission: 0,
        name: "Edition d'utilisateurs",
        description: "Modifie les paramètres d'un utilisateur (son image de profil, ses paramètres...)",
        test: true,
        body: {
            username: {
                type: 'string',
                required: false,
            },
            email: {
                type: 'string',
                required: false,
            },
            avatar: {
                type: 'data_url',
                required: false,
            },
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    username: '',
                    email: '',
                    permission: 0,
                    level: 0,
                    xp: 0,
                },
            },
            { code: 400, content: 'Bad Request: Username already exist' },
        ],
    },
    {
        method: 'POST',
        url: '/api/user/edit_password',
        func: [m.user_ctrl.edit_user_password],
        permission: 0,
        name: 'Changement de mot de passe',
        description: "Permet de modifier le mot de passe d'un utilisateur. Tous les champs sont obligatoires",
        test: true,
        body: {
            old_password: 'string',
            new_password: 'string',
            repeat_password: 'string',
        },
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Two password not match' },
            { code: 403, content: 'Old Password Not Correct' },
        ],
    },
    {
        method: 'GET',
        url: '/api/user/:id/avatar',
        func: [m.user_ctrl.get_avatar],
        permission: -1,
        name: "Récupération de l'avatar d'un utilisateur",
        description: "Récupération de de l'avatar d'un utilisateur sous la forme d'un fichier tout basique",
        result: [
            { code: 200, content: 'blob' },
            { code: 404, content: 'Not found' },
        ],
    },
    {
        method: 'GET',
        url: '/api/user/check_username/:username',
        func: [m.user_ctrl.check_username],
        permission: -1,
        name: "Vérification de l'username",
        description: "Verifie si le nom d'utilisateur passé en paramètre est encore disponible",
        test: true,
        result: [{ code: 200, content: { valid: 'true/false' } }],
    },
    {
        method: 'GET',
        url: '/api/user/get_all',
        func: [m.user_ctrl.get_all_user],
        permission: 100,
        name: 'Récupération de tous les utilisateurs',
        description: 'Récupère tous les utilisateurs',
        result: [
            {
                code: 200,
                content: [
                    {
                        id: 0,
                        username: '',
                    },
                ],
            },
        ],
    },
    {
        method: 'GET',
        url: '/api/user/get_user_with_roles',
        permission: 1000,
        name: 'Récupération de tous les utilisateurs et de leur permission',
        func: [m.user_ctrl.get_all_user_with_roles],
        result: [{ code: 200, content: [{ id: 0, username: '', permission: 0 }] }],
    },
    {
        method: 'POST',
        url: '/api/user/:id/permission',
        permission: 1000,
        name: "Modification des permissions d'un utilisateur",
        func: [m.user_ctrl.update_user_permission],
        body: {
            permission: 'number',
        },
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Cannot modify yourself' },
        ],
    },
];
module.exports.routes = routes;
