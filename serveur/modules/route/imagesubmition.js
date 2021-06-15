"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'ImageSubmition',
};
var routes = [
    {
        method: 'GET',
        url: '/api/imagesubmition/:id/image',
        func: [m.imagesubmition_ctrl.get_image],
        permission: -1,
        name: "Récupération d'une image soumise",
        description: "Renvoit l'image associée à un challenge sous la forme d'un simple fichier",
        result: [
            { code: 200, content: 'blob' },
            { code: 404, content: 'Not found' },
        ],
    },
    {
        method: 'POST',
        url: '/api/imagesubmition',
        func: [m.imagesubmition_ctrl.post_image],
        permission: 0,
        name: "Soumission d'une image",
        description: 'Soumet une image à un Obstacle de type action',
        body: {
            ParticipationId: 'number',
            img_data: 'data_url',
        },
        result: [
            {
                code: 200,
                content: {
                    EventId: 0,
                    ObstacleId: 0,
                    ok: false,
                    rejected: false,
                    updatedAt: 'date',
                    createdAt: 'date',
                },
            },
            { code: 400, content: 'Bad request: Participation not found' },
            { code: 400, content: 'Bad request: Not in an obstacle' },
            { code: 400, content: 'Bad request: Obstacle is not an action' },
        ],
    },
    {
        method: 'GET',
        url: '/api/imagesubmition',
        func: [m.imagesubmition_ctrl.get_all_soumission],
        permission: 100,
        name: 'Récupération des soumissions',
        description: 'Récupération de toutes les images soumisent pour validation mais pas encore validées',
        result: [
            {
                code: 200,
                content: [
                    {
                        ok: false,
                        rejected: false,
                        createdAt: 'date',
                        updatedAt: 'date',
                        EventId: 0,
                        ObstacleId: 0,
                    },
                ],
            },
        ],
    },
    {
        method: 'POST',
        url: '/api/imagesubmition/:id/judge',
        func: [m.imagesubmition_ctrl.juge_soumission],
        permission: 100,
        name: "Jugement d'une soumission",
        description: 'Valide ou invalide une image proposée',
        body: {
            valide: 'boolean',
        },
        result: [
            { code: 200, content: 'OK' },
            {
                code: 404,
                content: 'Not found',
            },
        ],
    },
];
module.exports.routes = routes;
