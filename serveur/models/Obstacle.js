'use strict';

module.exports = (sequelize, DataTypes) => {
  const Obstacle = sequelize.define(
    'Obstacle',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      distance: DataTypes.FLOAT,
      enigme_awnser: DataTypes.STRING,
    },
    {}
  );
  Obstacle.associate = function (models) {
    models.Obstacle.belongsTo(models.Segment, { onDelete: 'cascade' });
    models.Obstacle.belongsToMany(models.Event, {
      through: models.ImageSubmition,
    });
  };
  return Obstacle;
};
