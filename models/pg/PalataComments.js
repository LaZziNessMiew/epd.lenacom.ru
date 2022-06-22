const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'palata_comments'

module.exports = function (sequelize) {
    const PalataComments = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
        },
        create_date: {
            type: DataTypes.DATE,
        },
        upvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        downvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user_id: {
            type: DataTypes.STRING,
        },
        palata_post_id: {
            type: DataTypes.STRING,
        },
        reply_com_id: {
            type: DataTypes.STRING,
        },
        reply_user_id: {
            type: DataTypes.STRING,
        },
        nest_lvl: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        upvote_users: {
            type: DataTypes.JSONB,
            defaultValue: [] // по-умолчанию пустой массив
        },
        downvote_users: {
            type: DataTypes.JSONB,
            defaultValue: [] // по-умолчанию пустой массив
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return PalataComments
}