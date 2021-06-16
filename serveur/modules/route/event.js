"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'Event',
};
var routes = [
    {
        method: 'POST',
        url: '/api/event',
        func: [m.event_ctrl.post_event],
        permission: 0,
        body: {
            ParticipationId: 'number',
            type: {
                type: 'string',
                required: true,
                value: [
                    'marche',
                    'course',
                    'velo',
                    'pointpassage:arrivee',
                    'pointpassage:depart',
                    'obstacle:arrivee',
                ],
            },
            data: {
                type: 'number',
                required: false,
            },
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    type: 'type',
                    data: 0,
                    updatedAt: 'date',
                    createdAt: 'date',
                },
            },
            { code: 400, content: 'Bad request: No data' },
            { code: 400, content: 'Bad request: Participation not found' },
        ],
        name: 'Ajoute un évènement à une participation',
        description: "Certains types doivent avoir des données, d'autres non.\nData obligatoire pour le type marche [distance], course [distance], velo [distance], pointpassage:depart [segment choisi], pointpassage:arrivee [point atteind]",
    },
];
module.exports.routes = routes;
