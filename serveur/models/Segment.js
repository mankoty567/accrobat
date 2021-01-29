'use strict';

module.exports = (sequelize, DataTypes) => {
  const Segment = sequelize.define(
    'Segment',
    {
      distance: DataTypes.INTEGER,
    },
    {}
  );
  Segment.associate = function (models) {
    models.Segment.belongsTo(models.PointPassage, {
      as: 'pointStart',
      foreignKey: 'PointStartId',
    });
    models.Segment.belongsTo(models.PointPassage, {
      as: 'pointEnd',
      foreignKey: 'PointEndId',
    });
    models.Segment.hasMany(models.ChallengeCurrent);
    models.Segment.hasMany(models.Obstacle);
  };
  return Segment;
};
