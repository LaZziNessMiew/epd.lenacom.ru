const { Users, ForumPosts, ForumComments, Tags } = require('../../../../models/pg')
const { Op, Sequelize } = require("sequelize");
import { minutNazadFormat } from '../../../middleware/formats'
import { idDate } from '../../../middleware/formats'
import { verifyToken } from '../../../middleware/utils';

export default async function ApiPoleznoePosts(req, res) {
    let apiPath = 'api/poleznoe/posts'
    switch (req.method) {
        case 'GET':
            try {
                const { postId, limit, offset, count, mainPage } = req.query
                if (postId) { //получить один пост
                    let post = await ForumPosts.findOne({
                        attributes: ['id', 'title', 'content', 'create_date', 'views'],
                        include: [
                            {
                                model: Users, as: "user", attributes: ['login'],
                            },
                            {
                                model: Tags, as: "tag", attributes: ['name'],
                            }],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let login = ''
                        if (post.user) {
                            login = post.user.login
                        }
                        let data = {
                            id: post.id,
                            title: post.title,
                            content: post.content,
                            create_date: minutNazadFormat(post.create_date),
                            views: post.views,
                            author: post.user.login,
                            tagName: post.tag.name
                        }
                        let comments = await ForumComments.findAll({
                            attributes: ['id'],
                            include: [
                                {
                                    model: ForumPosts, as: "forum_post", attributes: ['id'], where: { id: post.id }
                                },
                            ],
                            raw: true,
                            nest: true
                        })
                        data.comments = comments.length
                        res.status(200).json({ data })
                    } else {
                        res.status(404).json({ msg: "Такого поста нет" })
                    }
                } else if (count) { //получить количество всех тем с определенным тегом
                    const count = await ForumPosts.count({
                        where: {
                            poleznoe: true
                        }
                    });
                    res.status(200).json({ data: count })
                } else if (mainPage) {//найти все посты для главной страницы
                    let posts
                    posts = await ForumPosts.findAll({
                        attributes: ['id', 'title', 'views', 'content'],
                        order: [
                            ['create_date', 'DESC'],
                        ],
                        include: [
                            {
                                model: Tags, as: "tag", attributes: ['latin'],
                            },
                        ],
                        limit: 5,
                        where: {
                            poleznoe: true
                        },
                    })
                    if (posts.length) {
                        let data = []
                        for (const post of posts) {
                            //добавить путь к первой картинке поста
                            let img = `/images/template/${post.tag.latin}.png`
                            for (const item of post.content) {
                                if (item[0] == 1) { //если блок контента картинка - то получить путь
                                    img = '/files/normal/' + item[1]; break
                                }
                            }
                            let tmp = {
                                id: post.id,
                                tag: post.tag,
                                title: post.title,
                                views: post.views,
                                img
                            }
                            let comments = await ForumComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: ForumPosts, as: "forum_post", attributes: ['id'], where: { id: post.id }
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
                } else { //получить все посты с poleznoe: true
                    let posts
                    posts = await ForumPosts.findAll({
                        attributes: ['id', 'title', 'content', 'create_date', 'views', 'poleznoe'],
                        order: [
                            ['create_date', 'DESC'],
                        ],
                        include: [
                            {
                                model: Users, as: "user", attributes: ['login']
                            },
                            {
                                model: Tags, as: "tag", attributes: ['latin']
                            },
                        ],
                        where: {
                            poleznoe: true
                        },
                        limit,
                        offset
                    })

                    if (posts.length) {
                        let data = []
                        for (const post of posts) {
                            let tmp = {
                                id: post.id,
                                title: post.title,
                                content: post.content,
                                create_date: minutNazadFormat(post.create_date),
                                views: post.views,
                                tag: post.tag.latin,
                                author: post.user.login,
                            }
                            let comments = await ForumComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: ForumPosts, as: "forum_post", attributes: ['id'], where: { id: post.id }
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
                        res.status(404).json({ msg: "Нет постов" })
                    }
                }
            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке тем', err
                })
            }
            break
        case 'POST':
            try {
                const { token, title, content, forumTag } = req.body
                if (token && title && content && forumTag) {
                    let curDate = new Date()
                    let curId = '1'
                    let post = await ForumPosts.findOne({
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
                        let tag = await Tags.findOne({
                            attributes: ['id', 'latin'],
                            where: {
                                latin: forumTag
                            },
                        })
                        let data = {
                            id: idDate(curDate) + curId,
                            title,
                            content,
                            create_date: new Date(),
                            views: 0,
                            user_id: verify.id,
                            tag_id: tag.id
                        }

                        await ForumPosts.create(data)
                        res.status(200).json({ msg: 'Тема добавлена', data: data.id })
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
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении поста', err
                })
            }
            break
        case 'PUT':
            try {
                const { token, postId, updateVote, change, title, content, create_date, viewed } = req.body
                // Изменение поста 
                if (token && postId && ((title || content) || (title && content))) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await ForumPosts.findOne({
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
                            await ForumPosts.update(data, {
                                where: {
                                    id: postId
                                }
                            })
                            res.status(200).json({ msg: "Пост был изменён" })
                        } else {
                            res.status(405).json({
                                msg: 'Время (15 минут) данное на изменение темы истекло'
                            })

                        }

                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                } else if (postId && viewed) {
                    let post = await ForumPosts.findOne({
                        attributes: ['views'],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let data = {
                            views: post.views + 1,
                        }
                        await ForumPosts.update(data, {
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
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при изменении темы', err
                })
            }
            break
        case 'DELETE':
            try {
                const { token, postId } = req.body
                if (token && postId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await ForumPosts.findOne({
                            where: {
                                id: postId
                            },
                        })
                        if (post) {
                            await ForumPosts.destroy({
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
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при изменении темы', err
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