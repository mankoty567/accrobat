'use strict';

module.exports = (sequelize, DataTypes) => {
  const PointPassage = sequelize.define(
    'PointPassage',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      x: DataTypes.INTEGER,
      y: DataTypes.INTEGER,
    },
    {}
  );
  PointPassage.associate = function (models) {
    models.PointPassage.belongsTo(models.Challenge);
    models.PointPassage.hasMany(models.Segment, {
      as: 'pointStart',
      foreignKey: 'PointStartId',
      onDelete: 'cascade',
    });
    models.PointPassage.hasMany(models.Segment, {
      as: 'pointEnd',
      foreignKey: 'PointEndId',
      onDelete: 'cascade',
    });
  };
  return PointPassage;
};
