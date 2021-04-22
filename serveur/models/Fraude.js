'use strict';

module.exports = (sequelize, DataTypes) => {
  const Fraude = sequelize.define(
    'Fraude',
    {
      type: DataTypes.STRING,
    },
    {}
  );
  Fraude.associate = function (models) {
    models.Fraude.belongsTo(models.User);
  };
  return Fraude;
};
