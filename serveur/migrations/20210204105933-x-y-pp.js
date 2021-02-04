'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PointPassages', 'x', {
      type: Sequelize.DataTypes.INTEGER,
    });
    await queryInterface.addColumn('PointPassages', 'y', {
      type: Sequelize.DataTypes.INTEGER,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropColumn('PointPassages', 'x');
    await queryInterface.dropColumn('PointPassages', 'y');
  },
};
