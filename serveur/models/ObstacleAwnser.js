'use strict';

module.exports = (sequelize, DataTypes) => {
  const ObstacleAwnser = sequelize.define(
    'ObstacleAwnser',
    {
      sub_img: DataTypes.TEXT,
    },
    {}
  );
  ObstacleAwnser.associate = function () {};
  return ObstacleAwnser;
};
