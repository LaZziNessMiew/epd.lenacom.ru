const { Notes } = require('../../../../models/pg')
const { Op } = require("sequelize");
import { verifyToken } from '../../../middleware/utils'

export default async function GetNotes(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const { subjectId, userId, token, action } = req.body
                let verify = verifyToken(token)
                // if (subjectId && createDate) {
                //     let data = {
                //         create_date: createDate,
                //         subject_id: subjectId,
                //         user_id: verify.id,
                //     }
                //     await Notes.create(data)
                //     res.status(200).json()
                // } else {
                //     res.status(400).json({
                //         msg: 'Заполните все обязательные поля'
                //     })
                // }

                if (subjectId && action && userId) {
                    let data = {
                        create_date: new Date(),
                        subject_id: subjectId,
                        user_id: userId,
                        action: action,
                        count: 1,
                        update_vote_users: [verify.id]
                    }
                    await Notes.create(data)
                    res.status(200).json()
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }


            } catch (err) {
                console.log('ERROR in api/notes/getNotes:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении поста', err
                })
            }
            break
        case 'GET':
            try {
                const { subjectId, userId, action } = req.query
                if (subjectId && userId && action) {
                    let post = await Notes.findOne({
                        attributes: ['id', 'user_id', 'subject_id', 'action', 'count', 'update_vote_users'],
                        where: {
                            user_id: userId,
                            subject_id: subjectId,
                            action: action,
                        },
                    })
                    if (post) {
                        res.status(200).json({ msg: "Пост уже существует" })
                    } else {
                        res.status(400).json({ msg: "Такого поста нет" })
                    }
                }
                else {
                    res.status(400).json({
                        msg: 'Ошибка при выгрузке данных'
                    })
                }
                // if (date) {

                //     let post = await PalataPosts.findOne({
                //         attributes: ['id', 'create_date','title'],
                //         include: [{ model: Users, as: "user", attributes: ['login'], }],
                //         where: {
                //             create_date:  date
                //         },
                //     })
                //     if (post) {
                //         let data = {
                //             id: post.id,
                //             create_date: minutNazadFormat(post.create_date),

                //         }
                //         res.status(200).json({ data })
                //     } else {
                //         res.status(400).json({ msg: "Такого поста нет" })
                //     }
                // }

            } catch (err) {
                console.log('ERROR in api/notes/getNotes:', err)
                res.status(500).json({
                    msg: 'Ошибка при изменении ', err
                })
            }
            break
        case 'PUT':
            try {
                const { subjectId, userId, action, token } = req.body
                let verify = verifyToken(token)
                if (subjectId && userId && action) {
                    let post = await Notes.findOne({
                        attributes: ['id', 'user_id', 'subject_id', 'action', 'count', 'update_vote_users'],
                        where: {
                            user_id: userId,
                            subject_id: subjectId,
                            action: action,
                        },
                    })
                    if (post.update_vote_users.includes(verify.id)) res.status(200).json({ msg: "Пользователь уже использовал эту функцию" })
                    else {
                        let data = {
                            count: post.count + 1,
                            update_vote_users: [...post.update_vote_users, verify.id]
                        }
                        await Notes.update(data, {
                            where: {
                                id: post.id
                            }
                        })
                        res.status(200).json({ msg: "EPD asdasdasd" })
                    }

                }
                else {
                    res.status(400).json({
                        msg: 'Ошибка при выгрузке данных'
                    })
                }
                // if (date) {

                //     let post = await PalataPosts.findOne({
                //         attributes: ['id', 'create_date','title'],
                //         include: [{ model: Users, as: "user", attributes: ['login'], }],
                //         where: {
                //             create_date:  date
                //         },
                //     })
                //     if (post) {
                //         let data = {
                //             id: post.id,
                //             create_date: minutNazadFormat(post.create_date),

                //         }
                //         res.status(200).json({ data })
                //     } else {
                //         res.status(400).json({ msg: "Такого поста нет" })
                //     }
                // }

            } catch (err) {
                console.log('ERROR in api/notes/getNotes:', err)
                res.status(500).json({
                    msg: 'Ошибка при изменении ', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'GET', 'POST')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })
            break
    }
}