'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    static associate(models) {
      // A job can have many candidate jobs
      Jobs.hasMany(models.Candidatejobs, {
        foreignKey: 'jID',
        onDelete: 'CASCADE'
      });
    }
  }

  Jobs.init({
    jID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,

    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hiringManager: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Jobs',
    indexes: [
      {
        unique: true,
        fields: ['title', 'company']
      }
    ]
  });

  return Jobs;
};
