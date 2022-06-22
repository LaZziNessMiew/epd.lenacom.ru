const { Users, NewsPosts, NewsComments } = require('../../../../models/pg')
import { minutNazadFormat } from '../../../middleware/formats'
import { verifyToken } from '../../../middleware/utils';

//Создаем nested comments
var globData = {}
function set(path, value) {
    var schema = globData;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
        var elem = pList[i];
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
}

export default async function CommentNews(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const { token, postId, content, replyComId } = req.body
                if (token, content) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let data = {
                            content,
                            upvote: 0,
                            downvote: 0,
                            create_date: new Date(),
                            views: 0,
                            user_id: verify.id,
                            newsPostId: postId,
                        }
                        if (replyComId) {
                            let comment = await NewsComments.findOne({
                                attributes: ['user_id', 'nest_lvl'],
                                where: {
                                    id: replyComId
                                }
                            })
                            if (comment) {
                                data.reply_com_id = replyComId
                                data.reply_user_id = comment.user_id
                                data.nest_lvl = (parseInt(comment.nest_lvl) + 1)
                            } else {
                                res.status(400).json({ msg: 'Комментарий к которому вы ссылаетесь удален', success: true, data })
                            }
                        }
                        await NewsComments.create(data)
                        let user = await Users.findOne({
                            attributes: ['login'],
                            where: {
                                id: verify.id
                            }
                        })
                        data.create_date = minutNazadFormat(data.create_date)
                        data.author = user.login
                        res.status(200).json({ msg: 'Комментарий добавлен', success: true, data })
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
                console.log('ERROR in api/smi/comments:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении комментария', err
                })
            }
            break
        case 'GET':
            try {
                const { postId, limit, offset } = req.query

                if (postId) {
                    let comments = await NewsComments.findAll({
                        attributes: ['id', 'content', 'create_date', 'upvote', 'downvote', 'reply_com_id', 'reply_user_id', 'nest_lvl', 'user_id'],
                        include: [
                            {
                                model: Users, as: "user", attributes: ['login'],
                            },
                            {
                                model: NewsPosts, as: "news_post", attributes: ['id'], where: { id: postId }
                            },
                        ],
                        order: [
                            ['nest_lvl', 'ASC'],
                            ['create_date', 'DESC'],
                        ],
                    })
                    if (comments.length) {
                        let temp = {} //Запоминаем всех родителей
                        for (const comment of comments) {
                            //Создаем nested comments
                            let tmp
                            if (comment.nest_lvl != 0) {
                                tmp = {
                                    id: comment.id,
                                    content: comment.content,
                                    create_date: minutNazadFormat(comment.create_date),
                                    upvote: comment.upvote,
                                    downvote: comment.downvote,
                                    author: comment.user.login,
                                    post: comment.news_post.id,
                                    reply_com_id: comment.reply_com_id,
                                    reply_user_id: comment.reply_user_id,
                                    nest_lvl: comment.nest_lvl,
                                    nest: {},
                                    user_id: comment.user_id,
                                }
                                if (typeof temp[comment.reply_com_id] != 'undefined') {
                                    temp[comment.id] = temp[comment.reply_com_id] + '.' + comment.reply_com_id + '.nest'
                                } else {
                                    temp[comment.id] = comment.reply_com_id + '.nest'
                                }
                                set(`${temp[comment.id]}.${comment.id}`, tmp);
                            } else {
                                tmp = {
                                    id: comment.id,
                                    content: comment.content,
                                    create_date: minutNazadFormat(comment.create_date),
                                    upvote: comment.upvote,
                                    downvote: comment.downvote,
                                    author: comment.user.login,
                                    post: comment.news_post.id,
                                    reply_com_id: comment.reply_com_id,
                                    reply_user_id: comment.reply_user_id,
                                    nest_lvl: comment.nest_lvl,
                                    nest: {},
                                    user_id: comment.user_id,
                                }
                                globData[comment.id] = tmp
                            }
                        }
                        res.status(200).json({ data: globData })
                    } else {
                        res.status(400).json({ msg: "Такого поста нет" })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log('ERROR in api/smi/comments:', err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке постов', err
                })
            }
            break
        case "PUT":
            try {
                const { token, commentId, content, updateVote } = req.body
                // Изменение поста 
                if (token && commentId && content) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let comment = await NewsComments.findOne({
                            attributes: ['create_date'],
                            where: {
                                id: commentId
                            },
                        })
                        if (new Date() - comment.create_date < 3000000) {
                            let data = {
                                content
                            }
                            await NewsComments.update(data, {
                                where: {
                                    id: commentId
                                }
                            })
                            res.status(200).json({ msg: "Комментарий был изменён" })
                        } else {
                            res.status(405).json({
                                msg: 'Время (5 минут) данное на изменение комментария истекло'
                            })

                        }
                    }
                }
                // Изменение кармы                 
                else if (token && commentId && typeof updateVote != 'undefined') {
                    let verify = verifyToken(token)
                    if (verify) {

                        let comment = await NewsComments.findOne({
                            attributes: ['upvote', 'downvote', 'upvote_users', 'downvote_users'],
                            where: {
                                id: commentId
                            },
                        })

                        if (updateVote == true) {
                            if (comment.upvote_users.includes(verify.id)) res.status(200).json({ msg: "Вы уже проголосовали" })

                            else {
                                if (comment.downvote_users.includes(verify.id)) {
                                    comment.downvote_users = comment.downvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        downvote_users: comment.downvote_users,
                                        downvote: comment.downvote - 1,
                                        upvote: comment.upvote + 1,
                                        upvote_users: [...comment.upvote_users, verify.id]
                                    }
                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос изменен" })
                                }
                                else {
                                    let data = {
                                        upvote: comment.downvote + 1,
                                        upvote_users: [...comment.upvote_users, verify.id]
                                    }

                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }

                            }

                        } else if (updateVote == false) {
                            if (comment.downvote_users.includes(verify.id)) res.status(200).json({ msg: "Вы уже проголосовали " })
                            else {
                                if (comment.upvote_users.includes(verify.id)) {
                                    comment.upvote_users = comment.upvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        upvote_users: comment.upvote_users,
                                        upvote: comment.upvote - 1,
                                        downvote: comment.downvote + 1,
                                        downvote_users: [...comment.downvote_users, verify.id]
                                    }
                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос изменен" })
                                }
                                else {
                                    let data = {
                                        downvote: comment.downvote + 1,
                                        downvote_users: [...comment.downvote_users, verify.id]
                                    }

                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
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
                else {
                    res.status(400).json({
                        msg: 'Требуется авторизация'
                    })
                }

            } catch (err) {
                console.log('ERROR in api/smi/comments:', err)
                res.status(500).json({
                    msg: 'Ошибка при изменении поста', err
                })
            }
            break
        case 'DELETE':
            try {
                const { token, commentId } = req.body
                if (token && commentId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await NewsComments.findOne({
                            where: {
                                id: commentId
                            },
                        })
                        if (post) {
                            await NewsComments.destroy({
                                where: {
                                    id: commentId
                                }
                            })
                            res.status(200).json({ msg: " Комментарий был удалён" })
                        } else {
                            res.status(400).json({
                                msg: 'Не найден комментарий'
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                }// Изменение кармы EPD
                else if (token && commentId && typeof updateVote != 'undefined') {
                    let verify = verifyToken(token)
                    if (verify) {

                        let comment = await NewsComments.findOne({
                            attributes: ['upvote', 'downvote', 'upvote_users', 'downvote_users'],
                            where: {
                                id: commentId
                            },
                        })

                        if (updateVote == true) {
                            if (comment.upvote_users.includes(verify.id)) res.status(200).json({ msg: "Вы уже проголосовали" })

                            else {
                                if (comment.downvote_users.includes(verify.id)) {
                                    comment.downvote_users = comment.downvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        downvote_users: comment.downvote_users,
                                        downvote: comment.downvote - 1,
                                        upvote: comment.upvote + 1,
                                        upvote_users: [...comment.upvote_users, verify.id]
                                    }
                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос изменен" })
                                }
                                else {
                                    let data = {
                                        upvote: comment.downvote + 1,
                                        upvote_users: [...comment.upvote_users, verify.id]
                                    }

                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос учтен" })
                                }

                            }

                        } else if (updateVote == false) {
                            if (comment.downvote_users.includes(verify.id)) res.status(200).json({ msg: "Вы уже проголосовали " })
                            else {
                                if (comment.upvote_users.includes(verify.id)) {
                                    comment.upvote_users = comment.upvote_users.filter(item => item !== verify.id)
                                    let data = {
                                        upvote_users: comment.upvote_users,
                                        upvote: comment.upvote - 1,
                                        downvote: comment.downvote + 1,
                                        downvote_users: [...comment.downvote_users, verify.id]
                                    }
                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
                                        }
                                    })
                                    res.status(200).json({ msg: "Ваш голос изменен" })
                                }
                                else {
                                    let data = {
                                        downvote: comment.downvote + 1,
                                        downvote_users: [...comment.downvote_users, verify.id]
                                    }

                                    await NewsComments.update(data, {
                                        where: {
                                            id: commentId
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

                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log('ERROR in api/smi/comments:', err)
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