'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserChallengeToVote = sequelize.define(
    'UserChallengeToVote',
    {
      vote: DataTypes.INTEGER,
    },
    {}
  );
  //UserChallengeToVote.associate = function () {};
  return UserChallengeToVote;
};
