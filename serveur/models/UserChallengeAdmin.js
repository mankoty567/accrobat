'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserChallengeAdmin = sequelize.define(
    'UserChallengeAdmin',
    {
      isAuthor: DataTypes.BOOLEAN,
    },
    {}
  );
  UserChallengeAdmin.associate = function (models) {
    models.UserChallengeAdmin.belongsTo(models.User);
    models.UserChallengeAdmin.belongsTo(models.Challenge);
  };
  return UserChallengeAdmin;
};
