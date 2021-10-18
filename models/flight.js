'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      Flight.belongsTo(models.Airport,{
        as: 'routesFrom',
        foreignKey: 'from'
      }),
      Flight.belongsTo(models.Airport,{
        as: 'routesTo',
        foreignKey: 'to'
      })
    }
  };
  Flight.init({
    distance: DataTypes.FLOAT,
    ground: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};