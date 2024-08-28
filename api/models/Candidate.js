const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Candidates extends Model {
    static associate(models) {
      // A Candidate can have many Candidate jobs
      Candidates.hasMany(models.Candidatejobs, {
        foreignKey: 'cID',
        onDelete:'CASCADE'
      });
    }
  }
  
  Candidates.init({
    cID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate:{
        isEmail: true,
    }
    },
  }, {
    sequelize,
    modelName: 'Candidates',
  });

  return Candidates;
};