'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Candidatejobs extends Model {
    static associate(models) {
      // A candidate job belongs to a candidate
      Candidatejobs.belongsTo(models.Candidates, {
        foreignKey: 'cID',
        onDelete:'CASCADE'
      });
      // A candidate job belongs to a job
      Candidatejobs.belongsTo(models.Jobs, {
        foreignKey: 'jID',
        onDelete:'CASCADE'
      });
      Candidatejobs.belongsTo(models.Admins, {
        foreignKey: 'ID',
      });
    }
  }

  Candidatejobs.init({
    cID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Candidates', // Name of the table
        key: 'cID',
      },
    },
    jID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jobs', // Name of the table
        key: 'jID',
      },
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Admins',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    modelName: 'Candidatejobs',
    indexes: [
      {
        unique: true,
        fields: ['cID', 'jID', 'admin']
      }
    ]
  });

  return Candidatejobs;
};