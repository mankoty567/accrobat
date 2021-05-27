'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserChallengeAdmin = sequelize.define(
    'UserChallengeAdmin',
    {
      isAuthor: DataTypes.BOOLEAN,
    },
    {}
  );
  //UserChallengeAdmin.associate = function () {};
  return UserChallengeAdmin;
};
