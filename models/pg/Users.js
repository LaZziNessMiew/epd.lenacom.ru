const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'users'

module.exports = function (sequelize) {
    const Users = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        login: {
            type: DataTypes.STRING,
        },
        pass: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        },
        fake: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        last_ip: {
            type: DataTypes.STRING,
        },
        banned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        karma: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        reg_date: {
            type: DataTypes.DATE,
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        phone: {
            type: DataTypes.STRING,
        },
        avatar: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Users
}