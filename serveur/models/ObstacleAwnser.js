'use strict';

module.exports = (sequelize, DataTypes) => {
  const ObstacleAwnser = sequelize.define(
    'ObstacleAwnser',
    {
      sub_img: DataTypes.TEXT,
    },
    {}
  );
  ObstacleAwnser.associate = function (models) {
    models.ObstacleAwnser.belongsTo(models.ChallengeCurrent);
    models.ObstacleAwnser.belongsTo(models.Obstacle);
  };
  return ObstacleAwnser;
};
