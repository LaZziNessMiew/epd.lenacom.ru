const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'weather'

module.exports = function (sequelize) {
    const Weather = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        day: {
            type: DataTypes.STRING,
        },
        time_of_day: {
            type: DataTypes.STRING,
        },
        weathers: {
            type: DataTypes.STRING,
        },
        temperature: {
            type: DataTypes.STRING
        },
        speed_wind: {
            type: DataTypes.STRING,
        },
        precipitation: {
            type: DataTypes.STRING,
        },

    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Weather
}