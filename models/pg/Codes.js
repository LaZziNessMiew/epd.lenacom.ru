const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'codes'

module.exports = function (sequelize) {
    const Codes = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
        },
        code: {
            type: DataTypes.STRING,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Codes
}