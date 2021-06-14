"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'Obstacle',
};
var routes = [
    {
        method: 'POST',
        url: '/api/obstacle',
        func: [m.obstacle_ctrl.post_obstacle],
        test: true,
        permission: 100,
        body: {
            title: 'string',
            description: 'string',
            type: {
                type: 'string',
                required: true,
                value: ['question', 'action'],
            },
            distance: 'number',
            SegmentId: 'number',
            enigme_awnser: {
                type: 'string',
                required: false,
            },
            enigme_img: {
                type: 'data_url',
                required: false,
            },
            frontId: {
                type: 'number',
                required: false,
            },
        },
        name: 'Création obstacle',
        description: 'Crée un obstacle sur un segment. Le champs enigme_awnser est obligatoire pour un obstacle de type question',
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    title: '',
                    description: '',
                    type: 'question/action',
                    distance: 0,
                    enigme_awnser: '',
                    SegmentId: 0,
                    updatedAt: 'date',
                    createdAt: 'date',
                },
            },
            {
                code: 400,
                content: 'Bad request',
            },
            { code: 400, content: 'Bad Request: Segment not found' },
            { code: 400, content: 'Bad request: Challenge is published' },
        ],
    },
    {
        method: 'POST',
        url: '/api/obstacle/answer',
        func: [m.obstacle_ctrl.awnser_obstacle],
        permission: 0,
        name: "Ajout d'une réponse",
        description: 'Propose une réponse à une question',
        body: {
            ParticipationId: 'number',
            awnser: 'string',
        },
        result: [
            { code: 200, content: { good: 'false/true' } },
            { code: 400, content: 'Bad request' },
            { code: 400, content: 'Bad request: Participation not found' },
            { code: 400, content: 'Bad request: Not in an obstacle' },
            { code: 400, content: 'Bad request: Obstacle is not a question' },
        ],
    },
    {
        method: 'GET',
        url: '/api/obstacle/:id/image',
        func: [m.obstacle_ctrl.get_image],
        permission: -1,
        name: "Récupération de l'image d'un obstacle",
        description: "Récupération de l'image liée à un obstacle sous la forme d'un fichier tout basique",
        result: [
            { code: 200, content: 'blob' },
            { code: 404, content: 'Not found' },
        ],
    },
    {
        method: 'POST',
        url: '/api/obstacle/:id',
        func: [m.obstacle_ctrl.update_obstacle],
        test: true,
        permission: 100,
        name: "Modification d'un obstacle",
        description: "Modifie les données d'un obstacle",
        body: {
            title: {
                type: 'string',
                required: false,
            },
            description: {
                type: 'string',
                required: false,
            },
            type: {
                type: 'string',
                required: false,
                value: ['question', 'action'],
            },
            distance: {
                type: 'number',
                required: false,
            },
            enigme_img: {
                type: 'data_url',
                required: false,
            },
            enigme_awnser: {
                type: 'string',
                required: false,
            },
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    title: '',
                    description: '',
                    type: 'question/action',
                    distance: 0,
                    enigme_awnser: '',
                    createdAt: 'date',
                    updatedAt: 'date',
                    SegmentId: 0,
                },
            },
        ],
    },
    {
        method: 'DELETE',
        url: '/api/obstacle/:id',
        func: [m.obstacle_ctrl.delete_obstacle],
        permission: 100,
        name: "Suppression d'un obstacle",
        description: "Supprime un obstacle si il n'est pas dans un challenge publié",
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Bad Request' },
            { code: 404, content: 'Obstacle not found' },
        ],
    },
];
module.exports.routes = routes;
