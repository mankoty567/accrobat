'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeCurrent = sequelize.define(
    'ChallengeCurrent',
    {
      distance: DataTypes.INTEGER,
    },
    {}
  );
  ChallengeCurrent.associate = function (models) {
    models.ChallengeCurrent.belongsTo(models.Participation, {
      onDelete: 'cascade',
    });
    models.ChallengeCurrent.belongsToMany(models.Obstacle, {
      through: models.ObstacleAwnser,
    });
    models.ChallengeCurrent.belongsTo(models.Segment, {
      onDelete: 'cascade',
      allowNull: true,
    });
    models.ChallengeCurrent.belongsTo(models.PointPassage, {
      onDelete: 'cascade',
      allowNull: true,
    });
  };
  return ChallengeCurrent;
};
