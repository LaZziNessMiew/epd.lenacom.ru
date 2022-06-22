const { Weather } = require('../../../../models/pg')
import { verifyToken } from '../../../middleware/utils';

export default async function Kurs(req, res) {
    let apiPath = 'api/weather/index'
    switch (req.method) {
        case 'GET':
            try {
                const { } = req.query
                let pogoda = await Weather.findAll({
                    attributes: ['day', 'time_of_day', 'weathers', 'temperature', 'speed_wind', 'precipitation'],
                })
                if (pogoda.length) {
                    let data = []
                    for (const pogod of pogoda) {
                        let tmp = {
                            day: pogod.day,
                            time_of_day: pogod.time_of_day,
                            weathers: pogod.weathers,
                            temperature: pogod.temperature,
                            speed_wind: pogod.speed_wind,
                            precipitation: pogod.precipitation,
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
                const { id, day, time_of_day, weathers, temperature, speed_wind, precipitation } = req.body
                if (day && time_of_day && weathers && temperature && speed_wind && precipitation) {
                    let data = {
                        id: id,
                        day: day,
                        time_of_day: time_of_day,
                        weathers: weathers,
                        temperature: temperature,
                        speed_wind: speed_wind,
                        precipitation: precipitation,
                    }
                    await Weather.create(data)
                    res.status(200).json({ msg: 'Погода добавлена ' })

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
                const { id, day, time_of_day, weathers, temperature, speed_wind, precipitation } = req.body
                // Изменение данных погоды
                if (id, day && time_of_day && weathers && temperature && speed_wind && precipitation) {
                    let pogoda = await Weather.findOne({
                        attributes: ['id', 'day', 'time_of_day', 'weathers', 'temperature', 'speed_wind', 'precipitation'],
                        where: {
                            id: id
                        },
                    })
                    if (pogoda) {
                        let data = {
                            day: day,
                            time_of_day: time_of_day,
                            weathers: weathers,
                            temperature: temperature,
                            speed_wind: speed_wind,
                            precipitation: precipitation,
                        }
                        await Weather.update(data, {
                            where: {
                                id: id,
                            }
                        })
                        res.status(200).json({ msg: 'Погода добавлена ' })
                    }
                    else {
                        res.status(400).json({ msg: 'Погода не добавлена ' })
                    }
                } else {
                    res.status(400).json({
                        msg: 'Ошибка: не найдено подходящего слота'
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