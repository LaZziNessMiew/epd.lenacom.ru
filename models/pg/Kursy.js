const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'kursy'

module.exports = function (sequelize) {
    const Kursy = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        },
        buy: {
            type: DataTypes.FLOAT,
        },
        sell: {
            type: DataTypes.FLOAT
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        update_date: {
            type: DataTypes.DATE,
        },
        type: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Kursy
}