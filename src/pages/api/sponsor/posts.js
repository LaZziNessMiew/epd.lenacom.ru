const { Ads } = require('../../../../models/pg')
const { Op } = require("sequelize");
import { minutNazadFormat } from '../../../middleware/formats'
import { verifyToken } from '../../../middleware/utils';

export default async function Posts(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const { token, title, content, tag } = req.body
                if (token && title && content && tag) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let data = {
                            name: title,
                            content,
                            create_date: new Date(),
                            tag
                        }
                        await Ads.create(data)
                        res.status(200).json({ msg: 'Заявка отправлена на одобрение', success: true })
                    } else {
                        res.status(400).json({
                            msg: 'Только авторизованные пользователи могут отправлять заявку'
                        })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log('ERROR in api/sponsor/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении заявки', err
                })
            }
            break
        case 'GET':
            try {
                const { active, tagId } = req.query
                let posts = await Ads.findAll({
                    attributes: ['id', 'content', 'name', 'active', 'tag', 'create_date'],
                    where: {
                        active: active
                    }
                })
                let data = []
                for (const post of posts) {
                    let tmp = {
                        id: post.id,
                        name: post.name,
                        content: post.content,
                        tag: post.tag,
                        create_date: post.create_date
                    }
                    data.push(tmp)
                }
                res.status(200).json({ data })
            }
            catch (err) {
                console.log('ERROR in api/sponsor/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке рекламы', err
                })
            }
            break
        case 'PUT':
            try {
                const { token, postId } = req.body
                // Одобрение админа 
                if (token && postId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let post = await Ads.findOne({
                            attributes: ['id', 'active'],
                            where: {
                                id: postId
                            },
                        })
                        let data = {
                            active: true,
                        }
                        await Ads.update(data, {
                            where: {
                                id: postId
                            }
                        })
                        res.status(200).json({ msg: "Ваш голос учтен" })

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