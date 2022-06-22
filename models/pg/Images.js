const { Sequelize, DataTypes } = require('sequelize')
const tableName = 's_images'

module.exports = function (sequelize) {
    const Images = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        create_date: {
            type: DataTypes.DATE,
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Images
}