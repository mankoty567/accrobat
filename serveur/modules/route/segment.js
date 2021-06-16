"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'Segment',
};
var routes = [
    {
        method: 'POST',
        url: '/api/segment',
        func: [m.segment_ctrl.post_segment],
        permission: 100,
        name: "Création d'un segment",
        description: 'Ajoute un segment rataché aux PointStart et PointEnd',
        test: true,
        body: {
            PointStartId: 'number',
            PointEndId: 'number',
            path: {
                type: [[0, 0]],
                required: true,
            },
            name: 'string',
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    PointStartId: 0,
                    PointEndId: 0,
                    path: [[0, 0]],
                    name: 'string',
                    updatedAt: 'date',
                    createdAt: 'date',
                },
            },
            { code: 400, content: 'Bad request: Challenge is published' },
            {
                code: 400,
                content: 'Bad request: PointStart and PointEnd are not in the same challenge',
            },
            { code: 404, content: 'PointStart/PointEnd Not Found' },
        ],
    },
    {
        method: 'GET',
        url: '/api/segment/:id',
        func: [m.segment_ctrl.get_segment],
        permission: 0,
        name: "Récupération d'un segment",
        description: 'Récupère le segment :id, ainsi que son PointStart et PointEnd',
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    path: [[0, 0]],
                    name: '',
                    PointStartId: 0,
                    PointEndId: 0,
                    pointStart: {
                        id: 0,
                        title: '',
                        description: '',
                        type: 'start/end/point',
                        x: 0,
                        y: 0,
                        ChallengeId: 0,
                    },
                    pointEnd: {
                        id: 0,
                        title: '',
                        description: '',
                        type: 'start/end/point',
                        x: 0,
                        y: 0,
                        ChallengeId: 0,
                    },
                },
            },
            {
                code: 404,
                content: 'Segment not found',
            },
        ],
    },
    {
        method: 'POST',
        url: '/api/segment/:id',
        name: "Mise à jour d'un segment",
        test: true,
        func: [m.segment_ctrl.update_segment],
        permission: 100,
        body: {
            path: {
                type: [[0, 0]],
                required: false,
            },
            name: {
                type: 'string',
                required: false,
            },
            PointStartId: {
                type: 'number',
                required: false,
            },
            PointEndId: {
                type: 'number',
                required: false,
            },
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    path: [[0, 0]],
                    name: '',
                    PointStartId: 0,
                    PointEndId: 0,
                },
            },
            {
                code: 400,
                content: 'Bad request: Challenge is published',
            },
            { code: 404, content: 'Not Found' },
        ],
    },
    {
        method: 'DELETE',
        url: '/api/segment/:id',
        name: 'Suppression de segment',
        func: [m.segment_ctrl.delete_segment],
        permission: 100,
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Bad request: Challenge is published' },
        ],
    },
];
module.exports.routes = routes;
