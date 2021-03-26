'use strict';

module.exports = (sequelize, DataTypes) => {
  const Segment = sequelize.define(
    'Segment',
    {
      path: DataTypes.JSON,
      name: DataTypes.STRING,
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
    models.Segment.hasMany(models.Obstacle, { onDelete: 'cascade' });
  };
  return Segment;
};
