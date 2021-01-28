module.exports = {
  development: {
    url: process.env.BDD_URL,
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    url: process.env.BDD_URL,
    dialect: 'mysql',
  },
};
