'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Challenges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      title: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.TEXT,
      img_fond: Sequelize.DataTypes.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('ChallengeCurrents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Obstacles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      title: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.TEXT,
      type: Sequelize.DataTypes.STRING,
      distance: Sequelize.DataTypes.INTEGER,
      enigme_img: Sequelize.DataTypes.TEXT,
      enigme_awnser: Sequelize.DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('ObstacleAwnsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      sub_img: Sequelize.DataTypes.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Participations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      startDate: Sequelize.DataTypes.DATE,
      endDate: Sequelize.DataTypes.DATE,
      isDone: Sequelize.DataTypes.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('PointPassages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      title: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.TEXT,
      type: Sequelize.DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Segments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      distance: Sequelize.DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      username: Sequelize.DataTypes.STRING,
      password: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      permission: Sequelize.DataTypes.INTEGER,
      level: Sequelize.DataTypes.INTEGER,
      xp: Sequelize.DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    await queryInterface.createTable('UserChallengeAdmins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      isAuthor: Sequelize.DataTypes.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
    });

    // LIAISONS
    await queryInterface.addColumn('ChallengeCurrents', 'ParticipationId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Participations',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('ChallengeCurrents', 'SegmentId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Segments',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('Obstacles', 'SegmentId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Segments',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('ObstacleAwnsers', 'ChallengeCurrentId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'ChallengeCurrents',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('ObstacleAwnsers', 'ObstacleId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Obstacles',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('Participations', 'UserId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('Participations', 'ChallengeCurrentId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'ChallengeCurrents',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('PointPassages', 'ChallengeId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Challenges',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('Segments', 'PointStartId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'PointPassages',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('Segments', 'PointEndId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'PointPassages',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('UserChallengeAdmins', 'UserId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('UserChallengeAdmins', 'ChallengeId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Challenges',
        },
        key: 'id',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
