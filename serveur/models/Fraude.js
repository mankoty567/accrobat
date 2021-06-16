'use strict';

module.exports = (sequelize, DataTypes) => {
  const Fraude = sequelize.define('Fraude', {}, {});
  Fraude.associate = function (models) {
    models.Fraude.belongsTo(models.User);
  };
  return Fraude;
};
