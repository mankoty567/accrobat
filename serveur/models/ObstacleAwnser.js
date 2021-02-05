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
    models.ObstacleAwnser.belongsTo(models.ChallengeCurrent, {
      onDelete: 'cascade',
    });
    models.ObstacleAwnser.belongsTo(models.Obstacle);
  };
  return ObstacleAwnser;
};
