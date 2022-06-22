const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'palata_posts'

module.exports = function (sequelize) {
    const PalataPosts = sequelize.define(tableName, {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.JSONB,
        },
        upvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        downvote: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        create_date: {
            type: DataTypes.DATE,
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        user_id: {
            type: DataTypes.STRING,
        },
        tag_id: {
            type: DataTypes.STRING,
            defaultValue: '30305ae2-e572-4690-bee1-87589655f5aa' // по-умолчанию тег "разное"
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
    return PalataPosts
}