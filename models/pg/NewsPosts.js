const { Sequelize, DataTypes } = require('sequelize')
const tableName = 'news_posts'

module.exports = function (sequelize) {
    const NewsPosts = sequelize.define(tableName, {
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
        emote1: {//happy
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        emote2: {//angry
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        emote3: {//shock
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        emote4: {//sad
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        emote5: {//think
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

    }, {
        timestamps: false,
        underscored: true,
        tableName
    })
    return NewsPosts
}