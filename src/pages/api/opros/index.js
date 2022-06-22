const { Opros, Users } = require('../../../../models/pg')
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

export default async function ApiOprosIndex(req, res) {
    let apiPath = 'api/opros'
    switch (req.method) {
        case 'GET':
            try {
                const { latest } = req.query
                if (latest) {
                    let opro = await Opros.findOne({
                        attributes: ['id', 'title', 'ans'],
                        order: [
                            ['create_date', 'DESC'],
                        ],
                    })
                    if (opro) {
                        //ans = [["Ответ 1", 5], ["Ответ 2", 0]]
                        let sum = 0
                        for (let i = 0; i < opro.ans.length; i++) {
                            sum += opro.ans[i][1]
                        }
                        let data = {
                            id: opro.id,
                            title: opro.title,
                            ans: opro.ans,
                            sum: sum
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(404).json({ msg: "Такой записи нет" })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }
            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при выполнении запроса', err
                })
            }
            break
        case 'POST':
            try {
                const { token, title, ans } = req.body
                if (token, title, ans) {
                    let verify = verifyToken(token)
                    let curDate = new Date()
                    if (verify) {
                        if (await isAdmin(verify.id) == true) {
                            let data = {
                                title: title,
                                ans: ans,
                                create_date: curDate
                            }
                            await Opros.create(data)
                            res.status(200).json({ msg: 'Опросник добавлен' })
                        } else {
                            res.status(400).json({
                                msg: 'Доступ запрещен'
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
                    msg: 'Ошибка при выполнении запроса', err
                })
            }
            break
        case 'PUT':
            try {
                const { ip, oprosId, ansId } = req.body
                if (typeof ip != 'undefined' && typeof oprosId != 'undefined' && typeof ansId != 'undefined') {
                    let opro = await Opros.findOne({
                        attributes: ['id', 'title', 'ans', 'ips'],
                        where: {
                            id: oprosId,
                        }
                    })
                    if (opro) { //если существует                                       
                        if (!opro.ips.includes(ip)) {
                            let ans = opro.ans

                            if ((ansId < ans.length) && (ansId >= 0)) {
                                for (let i = 0; i < ans.length; i++) {
                                    if (i == ansId) {
                                        ans[i][1] += 1
                                    }
                                }
                                //изменить данные
                                let data = {
                                    ans,
                                    ips: [...opro.ips, ip]
                                }
                                await Opros.update(data, {
                                    where: {
                                        id: oprosId,
                                    }
                                })
                                res.status(200).json({ msg: "Спасибо за участие в опросе", success: true })
                            } else {
                                res.status(400).json({
                                    msg: 'Неправильный запрос',
                                    success: false
                                })
                            }
                        } else {
                            res.status(400).json({
                                msg: 'С вашего IP уже проголосовали',
                                success: false
                            })
                        }
                    } else {
                        res.status(404).json({
                            msg: 'Опрос не найден'
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
                    msg: 'Ошибка при выполнении запроса', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'GET', 'POST', 'PUT')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })
            break
    }
}