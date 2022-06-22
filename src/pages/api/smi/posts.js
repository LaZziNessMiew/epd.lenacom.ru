const { Users, NewsPosts, NewsComments } = require('../../../../models/pg')
const { Op, Sequelize } = require("sequelize");
import { minutNazadFormat } from '../../../middleware/formats'
import { idDate } from '../../../middleware/formats'
import { verifyToken } from '../../../middleware/utils';

export default async function SmiPostsAPI(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const { postId, limit, offset, tagId, mainPage } = req.query
                if (postId) { //единичный пост
                    let post = await NewsPosts.findOne({
                        attributes: ['id', 'title', 'content', 'create_date', 'views', 'user_id', 'emote1', 'emote2', 'emote3', 'emote4', 'emote5'],
                        include: [{ model: Users, as: "user", attributes: ['login'], }],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let author = ''
                        if (post.user) {
                            author = post.user.login
                        }
                        let data = {
                            id: post.id,
                            title: post.title,
                            content: post.content,
                            create_date: minutNazadFormat(post.create_date),
                            views: post.views,
                            author: author,
                            user_id: post.user_id,
                            emote1: post.emote1,
                            emote2: post.emote2,
                            emote3: post.emote3,
                            emote4: post.emote4,
                            emote5: post.emote5,
                        }
                        let comments = await NewsComments.findAll({
                            attributes: ['id'],
                            include: [
                                {
                                    model: NewsPosts, as: "news_post", attributes: ['id'], where: { id: post.id }
                                },
                            ],
                            raw: true,
                            nest: true
                        })
                        data.comments = comments.length
                        res.status(200).json({ data })
                    } else {
                        res.status(400).json({ msg: "Такого поста нет" })
                    }
                } else if (mainPage) {//найти все посты для главной страницы
                    let posts
                    posts = await NewsPosts.findAll({
                        attributes: ['id', 'title', 'views', 'content'],
                        order: [
                            ['create_date', 'DESC'],
                        ],
                        limit: 5
                    })
                    if (posts.length) {
                        let data = []
                        for (const post of posts) {
                            //добавить путь к первой картинке поста
                            let img = '/images/template/template.png'
                            for (const item of post.content) {
                                if (item[0] == 1) { //если блок контента картинка - то получить путь
                                    img = '/files/normal/' + item[1]; break
                                }
                            }
                            let tmp = {
                                id: post.id,
                                title: post.title,
                                views: post.views,
                                img
                            }
                            let comments = await NewsComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: NewsPosts, as: "news_post", attributes: ['id'], where: { id: post.id }
                                    },
                                ],
                                raw: true,
                                nest: true
                            })
                            tmp.comments = comments.length
                            data.push(tmp)
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(400).json({ msg: "Нет данных" })
                    }
                } else { //все посты
                    let posts
                    if (tagId) { //с определенным тегом
                        posts = await NewsPosts.findAll({
                            attributes: ['id', 'title', 'content', 'create_date', 'views', 'tag_id'],
                            order: [
                                ['create_date', 'DESC'],
                            ],
                            include: [
                                { model: Users, as: "user", attributes: ['login'], },
                            ],
                            where: {
                                tag_id: {
                                    [Op.like]: '%' + tagId + '%'
                                }
                            },
                            limit,
                            offset
                        })
                    } else { //любые посты
                        posts = await NewsPosts.findAll({
                            attributes: ['id', 'title', 'content', 'create_date', 'views', 'user_id'],
                            order: [
                                ['create_date', 'DESC'],
                            ],
                            include: [
                                { model: Users, as: "user", attributes: ['login'], },
                            ],
                            limit,
                            offset
                        })
                    }
                    if (posts.length) {
                        let data = []
                        for (const post of posts) {
                            let author = ''
                            if (post.user) {
                                author = post.user.login
                            }
                            let tmp = {
                                id: post.id,
                                title: post.title,
                                content: post.content,
                                downvote: post.downvote,
                                create_date: minutNazadFormat(post.create_date),
                                views: post.views,
                                author: author,
                                user_id: post.user_id
                            }
                            let comments = await NewsComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: NewsPosts, as: "news_post", attributes: ['id'], where: { id: post.id }
                                    },
                                ],
                                raw: true,
                                nest: true
                            })
                            tmp.comments = comments.length
                            data.push(tmp)
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(400).json({ msg: "Нет постов" })
                    }
                }
            } catch (err) {
                console.log('ERROR in api/smi/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке постов', err
                })
            }
            break
        case 'POST':
            try {
                const { token, title, content } = req.body
                if (token && title && content) {
                    let curDate = new Date()
                    let curId = '1'
                    let post = await NewsPosts.findOne({
                        attributes: ['id'],
                        where: {
                            id: {
                                [Op.like]: `%${idDate(curDate)}%`
                            }
                        },
                        order: [
                            [Sequelize.cast(Sequelize.col('id'), 'BIGINT'), 'DESC']
                        ]
                    })
                    if (post) {
                        curId = parseInt(post.id.slice(6)) + 1
                    }

                    let verify = verifyToken(token)
                    if (verify) {
                        let data = {
                            id: idDate(curDate) + curId,
                            title,
                            content,
                            create_date: curDate,
                            views: 0,
                            user_id: verify.id,
                        }
                        await NewsPosts.create(data)
                        res.status(200).json({ msg: 'Пост добавлен', success: true, date: data.create_date })
                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log('ERROR in api/smi/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении поста', err
                })
            }
            break
        case 'PUT':
            try {
                const { token, postId, updateVote, title, content, viewed } = req.body
                // Изменение кармы 
                if (postId && typeof updateVote != 'undefined') {
                    let post = await NewsPosts.findOne({
                        attributes: ['emote1', 'emote2', 'emote3', 'emote4', 'emote5'],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let emote1 = parseInt(post.emote1), emote2 = parseInt(post.emote2), emote3 = parseInt(post.emote3), emote4 = parseInt(post.emote4), emote5 = parseInt(post.emote5)
                        if (updateVote == 1) {
                            emote1 += 1
                        } else if (updateVote == 2) {
                            emote2 += 1
                        } else if (updateVote == 3) {
                            emote3 += 1
                        } else if (updateVote == 4) {
                            emote4 += 1
                        } else if (updateVote == 5) {
                            emote5 += 1
                        }
                        let data = {
                            emote1,
                            emote2,
                            emote3,
                            emote4,
                            emote5
                        }
                        await NewsPosts.update(data, {
                            where: {
                                id: postId
                            }
                        })
                        res.status(200).json({ msg: "Спасибо за оценку" })
                    } else {
                        res.status(400).json({
                            msg: 'Неправильный запрос'
                        })
                    }

                }
                // Изменение поста 
                else if (token && postId && ((title || content) || (title && content))) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await NewsPosts.findOne({
                            attributes: ['create_date'],
                            where: {
                                id: postId
                            },
                        })
                        if (new Date() - post.create_date < 9000000) {
                            let data = {
                                title,
                                content
                            }
                            await NewsPosts.update(data, {
                                where: {
                                    id: postId
                                }
                            })
                            res.status(200).json({ msg: "Пост был изменён" })
                        } else {
                            res.status(405).json({
                                msg: 'Время (15 минут) данное на изменение поста истекло'
                            })

                        }

                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                }
                //просмотрено
                else if (postId && viewed) {
                    let post = await NewsPosts.findOne({
                        attributes: ['views'],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let data = {
                            views: post.views + 1,
                        }
                        await NewsPosts.update(data, {
                            where: {
                                id: postId
                            }
                        })
                        res.status(200).json({ msg: "Запись изменена" })
                    } else {
                        res.status(404).json({
                            msg: 'Запись не найдена'
                        })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }


            } catch (err) {
                console.log('ERROR in api/smi/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при изменении поста', err
                })
            }
            break
        case 'DELETE':
            try {
                const { token, postId } = req.body
                if (token && postId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await NewsPosts.findOne({
                            where: {
                                id: postId
                            },
                        })
                        if (post) {
                            await NewsPosts.destroy({
                                where: {
                                    id: postId
                                }
                            })
                            res.status(200).json({ msg: "Пост был удалён" })
                        } else {
                            res.status(400).json({
                                msg: 'Не найден пост'
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }


                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log('ERROR in api/smi/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при изменении поста', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'GET, PUT, DELETE')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })

            break
    }
}