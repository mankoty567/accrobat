const bdd = require('../models');

require('../serveur');

bdd.sequelize.sync({ drop: true });

/**
 * https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
 * https://medium.com/critigenopensource/mocha-unit-testing-pattern-test-suite-setup-code-for-file-separated-test-e339a550dbf6
 * https://www.chaijs.com/
 * https://mochajs.org/#getting-started
 */
