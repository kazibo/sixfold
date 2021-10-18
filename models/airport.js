'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    static associate(models) {
      Airport.hasMany(models.Flight, {
        foreignKey: 'from',
        as: 'routesFrom',
      });
      Airport.hasMany(models.Flight, {
        foreignKey: 'to',
        as: 'routesTo',
      });
    }
  };
  Airport.init({
    code: {
      type: DataTypes.STRING(3),
      primaryKey: true,
    },
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Airport',
  });
  return Airport;
};