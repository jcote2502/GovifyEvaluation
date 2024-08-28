'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jobs', {
      jID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hiringManager: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add a unique constraint for the composite key (title, company)
    await queryInterface.addConstraint('Jobs', {
      fields: ['title', 'company'],
      type: 'unique',
      name: 'unique_title_company',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Jobs', 'unique_title_company');
    await queryInterface.dropTable('Jobs');
  }
};
