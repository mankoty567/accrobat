'use strict';

module.exports = (sequelize, DataTypes) => {
  const PropositionChallenge = sequelize.define(
    'PropositionChallenge',
    {
      description: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {}
  );
  PropositionChallenge.associate = function (models) {
    models.PropositionChallenge.belongsTo(models.User);
  };
  return PropositionChallenge;
};
