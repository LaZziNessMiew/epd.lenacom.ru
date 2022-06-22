const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'opros'

module.exports = function (sequelize) {
    const Opros = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        ans: {
            type: DataTypes.JSONB,
            defaultValue: [] // по-умолчанию пустой массив
        },
        ips: {
            type: DataTypes.JSONB,
            defaultValue: [] // по-умолчанию пустой массив
        },
        create_date: {
            type: DataTypes.DATE,
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Opros
}