const { Tags } = require('../../../../models/pg')
import { verifyToken } from '../../../middleware/utils';

export default async function TagsApi(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const { name, type } = req.body
                if (name) {
                    let data = {
                        name,
                        type
                    }
                    await Tags.create(data)
                    res.status(200).json({ msg: 'Тег добавлен', success: true })
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля', err
                    })
                }
            } catch (err) {
                console.log('ERROR in api/service/tags:', err)
                res.status(500).json({
                    msg: 'Ошибка при добавлении тега', err
                })
            }
            break
        case 'GET':
            try {
                const { token, limit, offset } = req.query

                let posts = await Tags.findAll({
                    attributes: ['id', 'name', 'content'],
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
                            id: post.id,
                            name: post.name,
                            content: post.content,
                        }
                        data.push(tmp)
                    }
                    res.status(200).json({ data })
                } else {
                    res.status(400).json({ msg: "Нет постов" })
                }

            } catch (err) {
                console.log('ERROR in api/service/tags:', err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке постов', err
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