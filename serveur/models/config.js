module.exports = {
  development: {
    url: process.env.BDD_URL,
    dialect: 'mysql',
  },
  test: {
    url: process.env.BDD_URL,
    dialect: 'mysql',
  },
  production: {
    url: process.env.BDD_URL,
    dialect: 'mysql',
  },
};
