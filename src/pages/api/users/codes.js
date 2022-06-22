const { Users, Codes } = require('../../../../models/pg')

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

export default async function UsersCodesAPI(req, res) {
    let apiPath = 'api/users/codes'
    switch (req.method) {
        case 'POST':
            try {
                const { login, code } = req.body
                if (login && code) {

                    let codeRegister = await Users.findOne({
                        attributes: ['id', 'login'],
                        where: { login: login.toLowerCase() },
                        include: [
                            {
                                model: Codes, as: "codes",
                                attributes: ['id', 'user_id', 'code', 'create_date'],
                                order: [
                                    ['create_date', 'DESC'],
                                ],
                            },
                        ],
                    })
                    if (codeRegister) {
                        if (codeRegister.codes.length) {
                            if (codeRegister.id == codeRegister.codes[0].user_id) {
                                if (String(code) == codeRegister.codes[0].code) {
                                    let data = {
                                        confirmed: true
                                    }
                                    await Users.update(data, {
                                        where: {
                                            id: codeRegister.id
                                        }
                                    })
                                    await Codes.update(data, {
                                        where: {
                                            id: codeRegister.codes[0].id
                                        }
                                    })
                                    res.status(200).json({
                                        msg: 'Спасибо за регистрацию'
                                    })
                                } else {
                                    res.status(400).json({
                                        msg: 'Введенный код не подходит'
                                    })
                                }
                            } else {
                                createNewCode(codeRegister.id)
                                res.status(400).json({
                                    msg: 'Мы отправили на Вашу почту новый код, попробуйте еще раз'
                                })
                            }
                        } else {
                            createNewCode(codeRegister.id)
                            res.status(400).json({
                                msg: 'Мы отправили на Вашу почту новый код, попробуйте еще раз'
                            })
                        }
                    } else {
                        res.status(404).json({
                            msg: 'Этот аккаунт удален или забанен'
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
                    msg: 'Ошибка при подтверждении кода', err
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