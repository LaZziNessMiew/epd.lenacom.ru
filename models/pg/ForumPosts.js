const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'forum_posts'

module.exports = function (sequelize) {
    const ForumPosts = sequelize.define(tableName, {
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
        },
        poleznoe: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return ForumPosts
}