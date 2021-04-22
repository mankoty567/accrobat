'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeToVote = sequelize.define(
    'ChallengeToVote',
    {
      description: DataTypes.TEXT,
    },
    {}
  );
  ChallengeToVote.associate = function (models) {
    models.ChallengeToVote.belongsToMany(models.User, {
      through: models.UserChallengeToVote,
    });
  };
  return ChallengeToVote;
};
