const { Users, Codes } = require('../../../../models/pg')
const { Op } = require("sequelize");
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const KEY = process.env.JWTKEY;

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createNewCode(user_id) {
    let codeForUser = getRandomInRange(100000, 999999)
    let userData = {
        user_id,
        code: codeForUser,
        create_date: new Date(),
    }
    await Codes.create(userData)
}

export default async function Login(req, res) {
    let apiPath = 'api/users/login'
    switch (req.method) {
        case 'POST':
            try {
                const { login, pass } = req.body
                if (login && pass) {
                    let user = await Users.findOne({
                        where: {
                            [Op.or]: [
                                { login: login.toLowerCase() },
                                { email: login.toLowerCase() }
                            ]
                        }
                    })

                    if (user) {
                        if (user.confirmed == true) {
                            const passMatches = await bcrypt.compare(pass, user.pass)
                            if (passMatches) {
                                const payload = { /* Create JWT Payload */
                                    id: user.id,
                                }
                                const token = jwt.sign( /* Sign token */
                                    payload,
                                    KEY,
                                    {
                                        expiresIn: 31556926, // 1 year in seconds
                                    }
                                )
                                res.status(200).json({
                                    msg: 'Авторизация прошла успешно',
                                    logged: true,
                                    token,
                                })
                            } else {
                                res.status(200).json({
                                    msg: 'Неправильный логин, почта или пароль',
                                    logged: false
                                })
                            }
                        } else {
                            createNewCode(user.id)
                            res.status(203).json({
                                msg: 'Вы не подтвердили свою почту',
                                logged: false
                            })
                        }
                    } else {
                        res.status(200).json({
                            msg: 'Неправильный логин, почта или пароль'
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
                    msg: 'Ошибка при авторизации', err
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