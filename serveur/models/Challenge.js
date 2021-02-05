'use strict';

module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define(
    'Challenge',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      img_fond: DataTypes.TEXT,
    },
    {}
  );
  Challenge.associate = function (models) {
    models.Challenge.hasMany(models.UserChallengeAdmin, {
      onDelete: 'cascade',
    });
    models.Challenge.hasMany(models.Participation, { onDelete: 'cascade' });
    models.Challenge.hasMany(models.PointPassage, { onDelete: 'cascade' });
  };
  return Challenge;
};
