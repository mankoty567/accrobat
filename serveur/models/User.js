'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      permission: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      xp: DataTypes.INTEGER,
      googleToken: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    models.User.belongsToMany(models.ChallengeToVote, {
      through: models.UserChallengeToVote,
    });
    models.User.hasMany(models.Participation, { onDelete: 'cascade' });
    models.User.hasMany(models.Fraude, { onDelete: 'cascade' });
    models.User.hasMany(models.PropositionChallenge);
  };
  return User;
};
