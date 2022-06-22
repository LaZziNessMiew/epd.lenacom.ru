const { Users, PalataPosts, PalataComments } = require('../../../../models/pg')
const { Op, Sequelize } = require("sequelize");
import { minutNazadFormat } from '../../../middleware/formats'
import { idDate } from '../../../middleware/formats'
import { verifyToken } from '../../../middleware/utils';

export default async function SocialPostsAPI(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const { postId, limit, offset, tagId, mainPage } = req.query
                if (postId) {
                    let post = await PalataPosts.findOne({
                        attributes: ['id', 'title', 'content', 'upvote', 'downvote', 'create_date', 'views'],
                        include: [{ model: Users, as: "user", attributes: ['login'], }],
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
                            upvote: post.upvote,
                            downvote: post.downvote,
                            create_date: minutNazadFormat(post.create_date),
                            views: post.views,
                            author: login,
                        }
                        let comments = await PalataComments.findAll({
                            attributes: ['id'],
                            include: [
                                {
                                    model: PalataPosts, as: "palata_post", attributes: ['id'], where: { id: post.id }
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
                } else if (mainPage) {
                    let posts
                    posts = await PalataPosts.findAll({ //найти все посты для главной страницы
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
                                img: img
                            }
                            let comments = await PalataComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: PalataPosts, as: "palata_post", attributes: ['id'], where: { id: post.id }
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
                } else {
                    let posts
                    if (tagId) {
                        posts = await PalataPosts.findAll({
                            attributes: ['id', 'title', 'content', 'upvote', 'downvote', 'create_date', 'views', 'tag_id'],
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
                    } else {
                        posts = await PalataPosts.findAll({
                            attributes: ['id', 'title', 'content', 'upvote', 'downvote', 'create_date', 'views'],
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
                            let login = ''
                            if (post.user) {
                                login = post.user.login
                            }
                            let tmp = {
                                id: post.id,
                                title: post.title,
                                content: post.content,
                                upvote: post.upvote,
                                downvote: post.downvote,
                                create_date: minutNazadFormat(post.create_date),
                                views: post.views,
                                author: login,
                            }
                            let comments = await PalataComments.findAll({
                                attributes: ['id'],
                                include: [
                                    {
                                        model: PalataPosts, as: "palata_post", attributes: ['id'], where: { id: post.id }
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
                console.log('ERROR in api/social/posts:', err)
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

                    let post = await PalataPosts.findOne({
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
                            upvote: 0,
                            downvote: 0,
                            create_date: curDate,
                            views: 0,
                            user_id: verify.id,
                        }
                        await PalataPosts.create(data)
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
                console.log('ERROR in api/social/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении поста', err
                })
            }
            break
        case 'PUT':
            try {
                const { token, postId, updateVote, title, content, viewed } = req.body
                // Изменение кармы 
                if (token && postId && typeof updateVote != 'undefined') {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await PalataPosts.findOne({
                            attributes: ['upvote', 'downvote', 'upvote_users', 'downvote_users'],
                            where: {
                                id: postId
                            },
                        })

                        if (updateVote == true) {
                            if (post.upvote_users.includes(verify.id)) res.status(200).json({ msg: "Пользователь уже поставил лайк" })
                            else {
                                if (post.downvote_users.includes(verify.id)) {
                                    post.downvote_users = post.downvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        downvote_users: post.downvote_users,
                                        downvote: post.downvote - 1,
                                        upvote: post.upvote + 1,
                                        upvote_users: [...post.upvote_users, verify.id]
                                    }
                                    await PalataPosts.update(data, {
                                        where: {
                                            id: postId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }
                                else {
                                    let data = {
                                        upvote: post.upvote + 1,
                                        upvote_users: [...post.upvote_users, verify.id]
                                    }
                                    await PalataPosts.update(data, {
                                        where: {
                                            id: postId,
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }

                            }
                        } else if (updateVote == false) {
                            if (post.downvote_users.includes(verify.id)) res.status(200).json({ msg: "Пользователь уже поставил дизлайк " })
                            else {
                                if (post.upvote_users.includes(verify.id)) {
                                    post.upvote_users = post.upvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        upvote_users: post.upvote_users,
                                        upvote: post.upvote - 1,
                                        downvote: post.downvote + 1,
                                        downvote_users: [...post.downvote_users, verify.id]
                                    }
                                    await PalataPosts.update(data, {
                                        where: {
                                            id: postId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }
                                else {
                                    let data = {
                                        downvote: post.downvote + 1,
                                        downvote_users: [...post.downvote_users, verify.id]
                                    }
                                    await PalataPosts.update(data, {
                                        where: {
                                            id: postId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }
                            }
                        } else {
                            res.status(400).json({
                                msg: 'Неправильный запрос'
                            })
                        }

                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                }
                // Изменение поста 
                else if (token && postId && ((title || content) || (title && content))) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await PalataPosts.findOne({
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
                            await PalataPosts.update(data, {
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
                    let post = await PalataPosts.findOne({
                        attributes: ['views'],
                        where: {
                            id: postId
                        },
                    })
                    if (post) {
                        let data = {
                            views: post.views + 1,
                        }
                        await PalataPosts.update(data, {
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
                        msg: 'Требуется авторизация'
                    })
                }


            } catch (err) {
                console.log('ERROR in api/social/posts:', err)
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
                        let post = await PalataPosts.findOne({
                            where: {
                                id: postId
                            },
                        })
                        if (post) {
                            await PalataPosts.destroy({
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
                console.log('ERROR in api/social/posts:', err)
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