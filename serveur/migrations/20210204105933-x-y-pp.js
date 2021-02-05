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
    await queryInterface.removeColumn('PointPassages', 'x');
    await queryInterface.removeColumn('PointPassages', 'y');
  },
};
