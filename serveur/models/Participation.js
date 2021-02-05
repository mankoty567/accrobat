'use strict';

module.exports = (sequelize, DataTypes) => {
  const Participation = sequelize.define(
    'Participation',
    {
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      isDone: DataTypes.BOOLEAN,
    },
    {}
  );
  Participation.associate = function (models) {
    models.Participation.belongsTo(models.User);
    models.Participation.belongsTo(models.Challenge);
    models.Participation.hasOne(models.ChallengeCurrent, {
      onDelete: 'cascade',
    });
  };
  return Participation;
};
