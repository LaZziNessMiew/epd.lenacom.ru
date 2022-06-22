const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'tags'

module.exports = function (sequelize) {
    const Tags = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: { //название тега
            type: DataTypes.STRING,
        },
        type: { //тип тега forum | news | social
            type: DataTypes.STRING,
        },
        desc: { //описание
            type: DataTypes.STRING,
        },
        latin: {//если это ссылка то написать название латиницей
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Tags
}