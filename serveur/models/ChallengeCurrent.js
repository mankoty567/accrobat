'use strict';

module.exports = (sequelize) => {
  const ChallengeCurrent = sequelize.define('ChallengeCurrent', {}, {});
  ChallengeCurrent.associate = function (models) {
    models.ChallengeCurrent.belongsTo(models.Participation, {
      onDelete: 'cascade',
    });
    models.ChallengeCurrent.hasMany(models.ObstacleAwnser, {
      onDelete: 'cascade',
    });
    models.ChallengeCurrent.belongsTo(models.Segment);
  };
  return ChallengeCurrent;
};
