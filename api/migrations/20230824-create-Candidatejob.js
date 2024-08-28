'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Candidatejobs', {
      cID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Candidates',
          key: 'cID',
        },
        onDelete: 'CASCADE',
      },
      jID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobs', 
          key: 'jID',
        },
        onDelete: 'CASCADE',
      },
      admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Admins',
          key: 'ID',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });

    await queryInterface.addIndex('Candidatejobs', ['cID', 'jID', 'admin'], {
      unique: true,
      name: 'candidatejobs_unique_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Candidatejobs');
  }
};
