"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var m = require('../index');
module.exports.meta = {
    title: 'Fraude',
};
var routes = [
    {
        method: 'POST',
        url: '/api/fraude',
        func: [m.fraude_ctrl.post_fraude],
        name: 'Ajout de fraude',
        permission: 0,
        result: [{ code: 200, content: 'OK' }],
    },
    {
        method: 'GET',
        url: '/api/fraude',
        func: [m.fraude_ctrl.get_fraude],
        name: 'Récupération des fraudes',
        permission: 1000,
        result: [
            {
                code: 200,
                content: [
                    {
                        id: 0,
                        createdAt: 'date',
                        updatedAt: 'date',
                        UserId: 0,
                        User: {
                            id: 0,
                            username: '',
                        },
                    },
                ],
            },
        ],
    },
];
module.exports.routes = routes;
