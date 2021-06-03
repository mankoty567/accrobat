const bdd = require('../models');

const { server } = require('../serveur');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const mocha = require('mocha');

const ADMIN_PASSWORD = '123456';

module.exports.global = {};

module.exports.mochaHooks = {
  beforeAll: async () => {
    await bdd.sequelize.drop();
    await bdd.sequelize.sync();

    // Créations des entitées devant déjà être présantent dans l'api
    await bdd.User.create({
      username: 'admin',
      password: bcrypt.hashSync(ADMIN_PASSWORD, 12),
      email: 'admin@example.com',
      permission: 100,
      level: 0,
      xp: 0,
    });
  },
  afterAll: () => {
    server.close();
  },
};

/**
 * https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
 * https://medium.com/critigenopensource/mocha-unit-testing-pattern-test-suite-setup-code-for-file-separated-test-e339a550dbf6
 * https://www.chaijs.com/
 * https://mochajs.org/#getting-started
 */
