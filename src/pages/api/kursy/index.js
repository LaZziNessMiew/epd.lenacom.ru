const { Kursy } = require('../../../../models/pg')
import { verifyToken } from '../../../middleware/utils';

export default async function Kurs(req, res) {
    let apiPath = 'api/kursy/index'
    switch (req.method) {
        case 'GET':
            try {
                const { } = req.query
                let kurses = await Kursy.findAll({
                    attributes: ['id', 'name', 'buy', 'sell', 'update_date', 'type'],
                    order: [
                        ['name', 'ASC'],
                    ],
                })
                if (kurses.length) {
                    let data = []
                    for (const kurs of kurses) {
                        let tmp = {
                            id: kurs.id,
                            name: kurs.name,
                            buy: kurs.buy,
                            sell: kurs.sell,
                            update_date: kurs.update_date,
                            type: kurs.type,
                        }
                        data.push(tmp)
                    }
                    res.status(200).json({ data })
                } else {
                    res.status(400).json({ msg: "Нет данных" })
                }
            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при выгрузке записей', err
                })
            }
            break
        case 'POST':
            try {
                const { name, buy, sell, type } = req.body
                if (name && type) {
                    let data = {
                        name,
                        buy,
                        sell,
                        update_date: new Date(),
                        type,
                    }
                    await Kursy.create(data)
                    res.status(200).json({ msg: 'Запись добавлена', success: true })
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
                const { token, name, buy, sell, type } = req.body
                // Изменение данных курса валют 
                if (token && name && buy && sell && type) {
                    let verify = verifyToken(token)
                    if (verify) {
                        let kurs = await Kursy.findOne({
                            attributes: ['buy', 'sell'],
                            where: {
                                name: name,
                                type: type,
                            },
                        })
                        if (kurs) {
                            let data = {
                                buy: buy,
                                sell: sell,
                                update_date: new Date()
                            }
                            await Kursy.update(data, {
                                where: {
                                    name: name,
                                    type: type,
                                }
                            })
                            res.status(200).json({ msg: "Данные обновлены" })
                        } else {
                            res.status(400).json({ msg: "Неправильно введеные данные или не существует данного банка" })
                        }

                    } else {
                        res.status(400).json({
                            msg: 'Пользователь не авторизован'
                        })
                    }
                }
                else {
                    res.status(400).json({
                        msg: 'Заполните все обязательные поля'
                    })
                }

            } catch (err) {
                console.log(`ERROR in ${apiPath}:`, err)
                res.status(500).json({
                    msg: 'Ошибка при изменении записи', err
                })
            }
            break
        default:
            res.setHeader('Allow', 'POST')
            res.status(405).json({
                msg: 'Метод не разрешен'
            })
            break
    }
}