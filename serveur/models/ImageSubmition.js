'use strict';

module.exports = (sequelize, DataTypes) => {
  const ImageSubmition = sequelize.define(
    'ImageSubmition',
    {
      ok: DataTypes.BOOLEAN,
    },
    {}
  );
  ImageSubmition.associate = function () {};
  return ImageSubmition;
};
