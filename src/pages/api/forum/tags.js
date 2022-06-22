const { Tags, Users } = require('../../../../models/pg')
const { Op, Sequelize } = require("sequelize");
import { verifyToken } from '../../../middleware/utils';

async function isAdmin(id) {
    let user
    user = await Users.findOne({
        attributes: ['id', 'role'],
        where: {
            id: id
        },
    })
    if (user) {
        if (user.role == 'admin') {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export default async function TagsApi(req, res) {
    let apiPath = 'api/forum/tags'
    switch (req.method) {
        case 'POST':
            try {
                const { token, name, type, desc, latin } = req.body
                if (token && name) { //Добавить новый тег только админу
                    let verify = verifyToken(token)
                    if (verify) {
                        if (await isAdmin(verify.id) == true) {
                            let data = {
                                name,
                                type,
                                desc,
                                latin
                            }
                            await Tags.create(data)
                            res.status(200).json({ msg: 'Тег добавлен', success: true })
                        } else {
                            res.status(401).json({
                                msg: 'Доступ запрещен'
                            })
                        }
                    } else {
                        res.status(401).json({
                            msg: 'Доступ запрещен'
                        })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля', err
                    })
                }
            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении тега', err
                })
            }
            break
        case 'GET':
            try {
                const { tagName, limit, offset } = req.query
                if (tagName) { //проверить существует ли тег по названию
                    let post = await Tags.findOne({
                        attributes: ['id', 'name', 'desc', 'latin'],
                        order: [
                            ['name', 'ASC'],
                        ],
                        where: {
                            latin: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('latin')), 'LIKE', '%' + tagName.toLowerCase() + '%')
                        },
                    })
                    if (post) {
                        let data = {
                            name: post.name,
                            desc: post.desc,
                            latin: post.latin
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(404).json({ msg: "Нет записи" })
                    }
                } else { //выгрузить все теги
                    let posts = await Tags.findAll({
                        attributes: ['id', 'name', 'desc', 'latin'],
                        order: [
                            ['name', 'ASC'],
                        ],
                        limit,
                        offset
                    })
                    if (posts.length) {
                        let data = []
                        for (const post of posts) {
                            let tmp = {
                                name: post.name,
                                desc: post.desc,
                                latin: post.latin
                            }
                            data.push(tmp)
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(404).json({ msg: "Нет записей" })
                    }
                }
            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке записей', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'POST', 'GET')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })
            break
    }
}