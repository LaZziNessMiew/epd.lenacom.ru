const { PalataPosts } = require('../../../../models/pg')
const { Op } = require("sequelize");

export default async function GetPostsCount(req, res) {
    switch (req.method) {
        case 'GET':
            try {

                const count = await PalataPosts.count();
                res.status(200).json({ data: count })
            } catch (err) {
                console.log('ERROR in api/social/posts:', err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке постов', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'GET')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })

            break
    }
}