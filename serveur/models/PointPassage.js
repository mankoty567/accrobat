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
    });
    models.PointPassage.hasMany(models.Segment, {
      as: 'pointEnd',
      foreignKey: 'PointEndId',
    });
  };
  return PointPassage;
};
