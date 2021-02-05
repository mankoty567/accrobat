'use strict';

module.exports = (sequelize, DataTypes) => {
  const Obstacle = sequelize.define(
    'Obstacle',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      distance: DataTypes.INTEGER,
      enigme_img: DataTypes.TEXT,
      enigme_awnser: DataTypes.STRING,
    },
    {}
  );
  Obstacle.associate = function (models) {
    models.Obstacle.belongsTo(models.Segment);
    models.Obstacle.hasMany(models.ObstacleAwnser, { onDelete: 'cascade' });
  };
  return Obstacle;
};
