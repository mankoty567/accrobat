'use strict';

module.exports = (sequelize, DataTypes) => {
  const Participation = sequelize.define(
    'Participation',
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {}
  );
  Participation.associate = function (models) {
    models.Participation.belongsTo(models.User, { onDelete: 'cascade' });
    models.Participation.belongsTo(models.Challenge, { onDelete: 'cascade' });
    models.Participation.hasMany(models.Event, {
      onDelete: 'cascade',
    });
  };
  return Participation;
};
