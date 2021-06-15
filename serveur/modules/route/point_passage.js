"use strict";
/* eslint-disable quotes */
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'PointPassages',
};
var routes = [
    {
        method: 'GET',
        url: '/api/challenge/:id/point',
        func: [m.pointpassage_ctrl.get_pointpassage],
        permission: 0,
        name: 'Récupération des PointPassage',
        description: "Récupération des PointPassages d'un challenge",
        query: [
            {
                param: 'include=segment',
                desc: 'Met les segments dans pointStart et pointEnd',
            },
        ],
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    title: '',
                    description: '',
                    type: '',
                    x: 0.0,
                    y: 0.0,
                    createdAt: 'date',
                    updatedAt: 'date',
                    ChallengeId: 0,
                },
            },
        ],
    },
    {
        method: 'POST',
        url: '/api/challenge/:id/point',
        func: [m.pointpassage_ctrl.post_pointpassage],
        permission: 100,
        name: 'Ajout de PointPassage',
        description: 'Ajoute un PointPassage à un challenge',
        test: true,
        body: {
            title: 'string',
            description: { type: 'string', required: false },
            frontId: { type: 'number', required: false },
            type: {
                type: 'string',
                required: true,
                value: ['start', 'end', 'point'],
            },
            x: 'number',
            y: 'number',
        },
        result: [
            {
                code: 200,
                content: {
                    id: 0,
                    title: '',
                    description: '',
                    type: 'start/end/point',
                    x: 0,
                    y: 0,
                    ChallengeId: 0,
                    updatedAt: 'date',
                    createdAt: 'date',
                    frontId: 0,
                },
            },
            {
                code: 400,
                content: 'Bad request',
            },
            { code: 404, content: 'Challenge not exist' },
        ],
    },
    {
        method: 'DELETE',
        url: '/api/pointpassage/:id',
        func: [m.pointpassage_ctrl.delete_pointpassage],
        permission: 100,
        name: 'Suppression PointPassage',
        description: 'Suppression du PointPassage',
        result: [
            { code: 200, content: 'OK' },
            { code: 400, content: 'Bad request: Challenge is published' },
            { code: 404, content: 'PointPassage not found' },
        ],
    },
    {
        method: 'POST',
        url: '/api/pointpassage/:id',
        func: [m.pointpassage_ctrl.update_pointpassage],
        permission: 100,
        name: "Modification d'un PointPassage",
        description: "Modifie les attributs d'un point de passage",
        test: true,
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
                value: ['start', 'point', 'end'],
            },
            x: {
                type: 'number',
                required: false,
            },
            y: {
                type: 'number',
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
                    type: 'start/end/point',
                    x: 0,
                    y: 0,
                    ChallengeId: 0,
                    updatedAt: 'date',
                    createdAt: 'date',
                },
            },
        ],
    },
];
module.exports.routes = routes;
