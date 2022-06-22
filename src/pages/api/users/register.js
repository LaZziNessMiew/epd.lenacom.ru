const { Users, Codes } = require('../../../../models/pg')
import bcrypt from 'bcryptjs';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dosuopEmail = ["gmail.com", "mail.ru", "yandex.ru", "inbox.ru", "list.ru", "bk.ru", "internet.ru"]
export default async function Register(req, res) {
    let apiPath = 'api/users/register'
    switch (req.method) {
        case 'POST':
            try {
                const { login, email, pass, secondPass } = req.body

                if (login, email, pass, secondPass) { // обязательные параметры

                    if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(email)) {
                        if (!dosuopEmail.includes(email.split('@')[1])) {
                            res.status(202).json({ msg: 'Пожалуйста, укажите почтовый адрес из следующих сервисов: mail.ru, gmail, yandex' })
                            break
                        }
                    } else {
                        res.status(202).json({ msg: 'В почте присутствуют неразрешенные символы' })
                        break
                    }

                    if (!/^[a-zA-Z0-9_.]+$/g.test(login)) {
                        res.status(202).json({ msg: 'В логине присутсвуют неразрешенные символы' })
                        break
                    }

                    if (!/^[a-zA-Z0-9!@#$%^&*)(+=.,_-]+$/g.test(pass)) {
                        res.status(202).json({ msg: 'В пароли присутсвуют неразрешенные символы. Разрешены !@#$%^&*)(+=.,_-' })
                        break
                    }

                    let userExistsEmail = await Users.findOne({
                        where: { email: email, }
                    })
                    let userExistsLogin = await Users.findOne({
                        where: { login: login, }
                    })
                    if (userExistsEmail) {
                        res.status(202).json({ msg: 'Пользователь с такой почтой уже существует' })
                        break
                    } else if (userExistsLogin) {
                        res.status(202).json({ msg: 'Пользователь с таким логином уже существует' })
                        break
                    }

                    if (pass == secondPass) {
                        let userExistsEmail = await Users.findOne({
                            attributes: ['email'],
                            where: { email: email, }
                        })
                        let userExistsLogin = await Users.findOne({ where: { login: login, } })
                        if (userExistsEmail) {
                            res.status(202).json({ msg: 'Пользователь с такой почтой уже существует' })
                            break
                        } else if (userExistsLogin) {
                            res.status(202).json({ msg: 'Пользователь с таким логином уже существует' })
                            break
                        } else {
                            if (pass.length < 4) {
                                res.status(400).json({
                                    msg: 'Пароль должен содержать не менее 4 символов'
                                })
                            } else if (pass.length > 20) {
                                res.status(400).json({
                                    msg: 'Пароль должен содержать не более 20 символов'
                                })
                            } else {
                                const hash = bcrypt.hashSync(pass, 10);
                                let data = {
                                    login: login.toLowerCase(),
                                    pass: hash,
                                    email: email.toLowerCase(),
                                    reg_date: new Date(),
                                }
                                let result = await Users.create(data)

                                let codeForUser = getRandomInRange(100000, 999999)
                                let userData = {
                                    user_id: result.id,
                                    code: codeForUser,
                                    create_date: new Date(),
                                }
                                await Codes.create(userData)

                                /*
                                //отправить письмо активации по SMTP
                                let transporter = nodemailer.createTransport(smtpTransport({
                                    service: 'gmail',
                                    host: 'smtp.gmail.com',
                                    auth: {
                                        user: 'onahallark@gmail.com',
                                        pass: 'Parol115?!'
                                    }
                                }));
                                let mailOptions = {
                                    from: 'onahallark@gmail.com',
                                    to: `${result.email}`,
                                    subject: `tuimada.ru`,
                                    text: `Ваш код активации ${codeForUser.toString()}`
                                };
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                                */

                                //Вывод
                                res.status(200).json({ msg: `Мы отправили на почту ${data.email} письмо с кодом активации` })
                            }
                        }
                    } else {
                        res.status(400).json({
                            msg: 'Указанные пароли не совпадают'
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
                    msg: 'Ошибка при регистрации', err
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