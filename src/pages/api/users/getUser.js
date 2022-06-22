const { Users } = require('../../../../models/pg')
import { verifyToken } from '../../../middleware/utils';
export default async function Template(req, res) {
    let apiPath = "api/users/getUser"
    switch (req.method) {
        case 'GET':
            try {
                const { token } = req.query
                let verify = verifyToken(token)
                if (verify) {
                    let user = await Users.findOne({
                        attributes: ['id', 'login'],
                        where: {
                            id: verify.id
                        }
                    })
                    let data = {
                        login: user.login,
                    }
                    res.status(200).json({ data })
                }
                else {
                    res.status(400).json({
                        msg: 'Пользователь не авторизован'
                    })
                }
            }
            catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке пользователя', err
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