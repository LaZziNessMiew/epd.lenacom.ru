const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'notes'

module.exports = function (sequelize) {
    const Notes = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        viewed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        count: {
            type: DataTypes.INTEGER,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        action: {
            type: DataTypes.STRING,
        },
        subject_id: {
            type: DataTypes.STRING,
        },
        update_vote_users: {
            type: DataTypes.JSONB,
            defaultValue: [] // по-умолчанию пустой массив
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return Notes
}