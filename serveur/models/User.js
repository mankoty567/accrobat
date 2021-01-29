'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      permission: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      xp: DataTypes.INTEGER,
    },
    {}
  );
  User.associate = function (models) {
    models.User.hasMany(models.UserChallengeAdmin);
    models.User.hasMany(models.Participation);
  };
  return User;
};
