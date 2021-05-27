'use strict';

module.exports = (sequelize, DataTypes) => {
  const RequestLog = sequelize.define(
    'RequestLog',
    {
      method: DataTypes.STRING,
      path: DataTypes.STRING,
      body: DataTypes.JSON,
      headers: DataTypes.JSON,
    },
    {}
  );
  //RequestLog.associate = function () {};
  return RequestLog;
};
