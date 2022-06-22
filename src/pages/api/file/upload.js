import formidable from "formidable";
import fs from "fs";
const { Op, Sequelize } = require("sequelize");
const { Images } = require('../../../../models/pg')
import { idDate } from '../../../middleware/formats'

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function fileUpload(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                await new Promise((resolve, reject) => {
                    const form = new formidable.IncomingForm();
                    form.parse(req, async function (err, fields, files) {

                        let curDate = new Date()
                        let curId = '1'
                        let post = await Images.findOne({
                            attributes: ['id'],
                            where: {
                                id: {
                                    [Op.like]: `%${idDate(curDate)}%`
                                }
                            },
                            order: [
                                [Sequelize.cast(Sequelize.col('id'), 'BIGINT'), 'DESC']
                            ]
                        })
                        if (post) {
                            curId = parseInt(post.id.slice(6)) + 1
                        }
                        let data = {
                            id: idDate(curDate) + curId,
                            create_date: new Date(),
                        }
                        await Images.create(data)

                        const img = fs.readFileSync(files.file.filepath);
                        fs.writeFileSync(`./files/normal/${data.id}`, img);
                        fs.unlinkSync(files.file.filepath);
                        return res.status(200).json({ msg: data.id })
                    });
                })
            } catch (err) {
                console.log('ERROR in api/file/upload:', err)
                res.status(500).json({
                    msg: 'Ошибка при загрузке изображения', err
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