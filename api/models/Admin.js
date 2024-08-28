'use strict';
const {Model} = require('sequelize');
const bcrypt = require("bcryptjs");


module.exports = (sequelize, DataTypes) => {
    class Admins extends Model {
        static associate(models) {

            Admins.hasMany(models.Candidatejobs, {
                foreignKey: 'admin',
            });
        }
    }

    Admins.init({
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            allowNull: false,
            primaryKey:true,
        },
        email: {
            type: DataTypes.STRING,
            unique:true,
            allowNull: false,
            validate:{
                isEmail: true,
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                isLongEnough: (value) => {
                  if (value.length < 8) {
                    throw new Error("Please choose a larger password");
                  }
                },
              },            
        },
        token:{
            unique:true,
            type:DataTypes.STRING,
        }
    },{
        sequelize,
        modelName: 'Admins'
    });

    return Admins;
}