'use strict';

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      type: DataTypes.STRING,
      data: DataTypes.FLOAT,
    },
    {}
  );
  Event.associate = function (models) {
    models.Event.belongsTo(models.Participation);
    models.Event.belongsToMany(models.Obstacle, {
      through: models.ImageSubmition,
    });
  };
  return Event;
};
