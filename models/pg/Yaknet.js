const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'yaknet'

module.exports = function (sequelize) {
    const Yaknet = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        weight: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        rate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        visits: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        desc: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        link: {
            type: DataTypes.BOOLEAN,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        likes: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Yaknet
}