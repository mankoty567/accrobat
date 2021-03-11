'use strict';

module.exports = (sequelize, DataTypes) => {
  const ImageSubmition = sequelize.define(
    'ImageSubmition',
    {
      img: DataTypes.TEXT,
    },
    {}
  );
  ImageSubmition.associate = function () {};
  return ImageSubmition;
};
