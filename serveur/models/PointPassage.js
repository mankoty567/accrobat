'use strict';

module.exports = (sequelize, DataTypes) => {
  const PointPassage = sequelize.define(
    'PointPassage',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
    },
    {}
  );
  PointPassage.associate = function (models) {
    models.PointPassage.belongsTo(models.Challenge);
    models.PointPassage.hasMany(models.Segment, { as: 'pointStart' });
    models.PointPassage.hasMany(models.Segment, { as: 'pointEnd' });
  };
  return PointPassage;
};
