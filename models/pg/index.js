const Sequelize = require('sequelize') // import sequelize


// настройки и подключение БД
const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: process.env.DBHOST,
    dialect: 'postgres',
    logging: false,
    port: process.env.DBPORT,
})


// модели
const Users = require('./Users')(sequelize)
const Codes = require('./Codes')(sequelize)
const PalataPosts = require('./PalataPosts')(sequelize)
const PalataComments = require('./PalataComments')(sequelize)
const Tags = require('./Tags')(sequelize)
const Notes = require('./Notes')(sequelize)
const ForumPosts = require('./ForumPosts')(sequelize)
const ForumComments = require('./ForumComments')(sequelize)
const Ads = require('./Ads')(sequelize)
const Yaknet = require('./Yaknet')(sequelize)
// модели stena
const StenaPosts = require('./StenaPosts')(sequelize)
const StenaComments = require('./StenaComments')(sequelize)
// модели news
const NewsPosts = require('./NewsPosts')(sequelize)
const NewsComments = require('./NewsComments')(sequelize)
//модели данные курс валют
const Kursy = require('./Kursy')(sequelize)
//модели загружаемых картинок
const Images = require('./Images')(sequelize)
//модели опросов
const Opros = require('./Opros')(sequelize)
//модели загружаемых данных о погоде
const Weather = require('./Weather')(sequelize)


//Ассоциации
Users.hasMany(Codes); Codes.belongsTo(Users, { foreignKey: 'user_id' })
// Ассоциации news
Users.hasMany(NewsPosts); NewsPosts.belongsTo(Users, { foreignKey: 'user_id' })
Users.hasMany(NewsComments); NewsComments.belongsTo(Users, { foreignKey: 'user_id' })
NewsPosts.hasMany(NewsComments); NewsComments.belongsTo(NewsPosts, { foreignKey: 'news_post_id' })
// Форум ассоциации
Users.hasMany(ForumPosts); ForumPosts.belongsTo(Users, { foreignKey: 'user_id' })
Users.hasMany(ForumComments); ForumComments.belongsTo(Users, { foreignKey: 'user_id' })
ForumPosts.hasMany(ForumComments); ForumComments.belongsTo(ForumPosts, { foreignKey: 'forum_post_id' })
// Ассоциации social
Users.hasMany(PalataPosts); PalataPosts.belongsTo(Users, { foreignKey: 'user_id' })
Users.hasMany(PalataComments); PalataComments.belongsTo(Users, { foreignKey: 'user_id' })
PalataPosts.hasMany(PalataComments); PalataComments.belongsTo(PalataPosts, { foreignKey: 'palata_post_id' })
// Ассоциации stena
Users.hasMany(StenaPosts); StenaPosts.belongsTo(Users, { foreignKey: 'user_id' })
Users.hasMany(StenaComments); StenaComments.belongsTo(Users, { foreignKey: 'user_id' })
StenaPosts.hasMany(StenaComments); StenaComments.belongsTo(StenaPosts, { foreignKey: 'stena_post_id' })
//epd уведомление
Users.hasMany(Notes); Notes.belongsTo(Users, { foreignKey: 'user_id' })
//Ассоциации теги
Tags.hasMany(ForumPosts); ForumPosts.belongsTo(Tags, { foreignKey: 'tag_id' })


// экспорт
module.exports = {
    Users,
    Codes,
    PalataPosts,
    PalataComments,
    Tags,
    Notes,
    NewsPosts,
    NewsComments,
    ForumPosts,
    ForumComments,
    StenaPosts,
    StenaComments,
    Ads,
    Yaknet,
    Kursy,
    Images,
    Opros,
    Weather
}