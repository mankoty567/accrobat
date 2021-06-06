'use strict';

module.exports = (sequelize, DataTypes) => {
  const ImageSubmition = sequelize.define(
    'ImageSubmition',
    {
      ok: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  );
  //ImageSubmition.associate = function () {};
  return ImageSubmition;
};
