const { Yaknet, Users } = require('../../../../models/pg')
const { Op, Sequelize } = require("sequelize");
import { verifyToken } from '../../../middleware/utils';
import { convertStampDate } from '../../../middleware/formats'
import { ContactSupportOutlined } from '@mui/icons-material';

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

export default async function YaknetRecordsdAPI(req, res) {
    let apiPath = 'api/yaknet/record'
    switch (req.method) {
        case 'GET':
            try {
                const { recordId, limit, offset, random, getCount } = req.query
                if (recordId) { //выгрузить информацию о конкретной записи 
                    let record = await Yaknet.findOne({
                        attributes: ['id', 'name', 'desc', 'weight', 'rate', 'link', 'active', 'visits', 'create_date'],
                        where: {
                            id: recordId
                        },
                    })
                    if (record) {
                        let data = {
                            id: record.id,
                            name: record.name,
                            desc: record.desc,
                            weight: record.weight,
                            rate: record.rate,
                            link: record.link,
                            active: record.active,
                            visits: record.visits,
                            create_date: convertStampDate(record.create_date),
                            likes: record.likes
                        }
                        res.status(200).json({ data })
                    } else {
                        res.status(404).json({ msg: "Такой записи нет" })
                    }
                } else if (getCount) {
                    let count
                    count = await Yaknet.count();
                    res.status(200).json({ data: count })
                } else { //выгрузить информацию о всех записях
                    let records
                    if (random) { //вывести случайные записи
                        records = await Yaknet.findAll({
                            attributes: ['id', 'name', 'desc', 'link'],
                            order: [
                                [Sequelize.literal('RANDOM()')]
                            ],
                            limit,
                            offset
                        })
                    } else {
                        records = await Yaknet.findAll({
                            attributes: ['id', 'name', 'desc', 'weight', 'rate', 'link', 'active', 'visits', 'create_date'],
                            order: [
                                ['weight', 'DESC'],
                            ],
                            limit,
                            offset
                        })
                    }

                    if (records.length) {
                        let data = []
                        for (const record of records) {
                            let tmp
                            if (random) {
                                tmp = {
                                    name: record.name,
                                    desc: record.desc,
                                    link: record.link,
                                }
                            } else {
                                tmp = {
                                    id: record.id,
                                    name: record.name,
                                    desc: record.desc,
                                    weight: record.weight,
                                    rate: record.rate,
                                    link: record.link,
                                    active: record.active,
                                    visits: record.visits,
                                    create_date: convertStampDate(record.create_date),
                                    likes: record.likes
                                }
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
        case 'POST':
            try {
                const { token, name, desc, link, weight, rate, active, visits } = req.body
                if (token && name && link) {
                    let verify = verifyToken(token)
                    if (verify) {
                        if (await isAdmin(verify.id) == true) {
                            let data = {
                                name,
                                desc,
                                link,
                                weight,
                                rate,
                                active,
                                visits,
                                create_date: new Date(),
                                active
                            }
                            await Yaknet.create(data)
                            res.status(200).json({ msg: 'Запись добавлена', success: true })
                        } else {
                            res.status(400).json({
                                msg: 'Доступ запрещен'
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Доступ запрещен'
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
                    msg: 'Ошибка при добавлении записи', err
                })
            }
            break
        case 'PUT':
            try {
                const { token, recordId, name, desc, link, weight, rate, active, visits } = req.body
                //изменение записи
                if (token && recordId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        if (await isAdmin(verify.id) == true) {
                            let record
                            record = await Yaknet.findOne({
                                where: {
                                    id: recordId
                                },
                            })
                            if (record) {
                                let data = {
                                    name,
                                    desc,
                                    link,
                                    weight,
                                    rate,
                                    active,
                                    visits,
                                    create_date: new Date(),
                                    active
                                }
                                await Yaknet.update(data, {
                                    where: {
                                        id: recordId
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
                                msg: 'Доступ запрещен'
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Доступ запрещен'
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
                    msg: 'Ошибка при изменении записи', err
                })
            }
            break
        case 'DELETE':
            try {
                const { token, recordId } = req.body
                //удаление записи
                if (token && recordId) {
                    let verify = verifyToken(token)
                    if (verify) {
                        if (await isAdmin(verify.id) == true) {
                            let record
                            record = await Yaknet.findOne({
                                where: {
                                    id: recordId
                                },
                            })
                            if (record) {
                                await Yaknet.destroy({
                                    where: {
                                        id: recordId
                                    }
                                })
                                res.status(200).json({
                                    msg: "Запись удалена"
                                })
                            } else {
                                res.status(404).json({
                                    msg: 'Запись не найдена'
                                })
                            }
                        } else {
                            res.status(400).json({
                                msg: 'Доступ запрещен'
                            })
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Доступ запрещен'
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