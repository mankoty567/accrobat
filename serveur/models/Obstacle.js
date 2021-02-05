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
    models.Obstacle.belongsTo(models.Segment, { onDelete: 'cascade' });
    models.Obstacle.belongsToMany(models.ChallengeCurrent, {
      through: models.ObstacleAwnser,
    });
  };
  return Obstacle;
};
