const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'ads'

module.exports = function (sequelize) {
    const Ads = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.JSONB,
        },
        tag: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: null
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Ads
}