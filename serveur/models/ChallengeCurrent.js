'use strict';

module.exports = (sequelize) => {
  const ChallengeCurrent = sequelize.define('ChallengeCurrent', {}, {});
  ChallengeCurrent.associate = function (models) {
    models.ChallengeCurrent.belongsTo(models.Participation);
    models.ChallengeCurrent.hasMany(models.ObstacleAwnser);
    models.ChallengeCurrent.belongsTo(models.Segment);
  };
  return ChallengeCurrent;
};
