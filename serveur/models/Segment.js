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
      onDelete: 'cascade',
    });
    models.Segment.belongsTo(models.PointPassage, {
      as: 'pointEnd',
      foreignKey: 'PointEndId',
      onDelete: 'cascade',
    });
    models.Segment.hasMany(models.ChallengeCurrent, { onDelete: 'cascade' });
    models.Segment.hasMany(models.Obstacle, { onDelete: 'cascade' });
  };
  return Segment;
};
