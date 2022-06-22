import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/router";

// bootstrap
import Form from 'react-bootstrap/Form'
//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice";
//back-cookies
import cookies from 'next-cookies'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


export default function AdsNew(props) {
    //refs
    const hiddenFileInput = useRef(null);
    //states
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [tag, setTag] = useState(null)
    const [content, setContent] = useState([])
    const dispatch = useDispatch(" "); //redux

    //Категории 
    var value = ['Разное', 'Рестораны', 'Строительство']
    const handleChange = (event) => {
        setTag(event.target.value);
    }

    //модульная система постов
    const addPostModule = (val) => {
        if (val == 0) { //текст
            setContent(content => [...content, [val, '']])
        } else if (val == 1) { //изображение
            hiddenFileInput.current.click();
        }
    }

    //Добавить пост
    const dobavitPost = async (e) => {
        e.preventDefault()
        let req = await fetch(`/api/sponsor/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: props.token, title, content, tag })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            if (req.status == 200) {
                router.push('/banner')
            }
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux        
    }

    //Загрузить изображение в браузер
    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            uploadToServer(i)
        }
    };

    //Загрузить изображение на сервер
    const uploadToServer = async (image) => {
        let body = new FormData();
        body.append("file", image);
        let req = await fetch(`/api/file/upload`, {
            method: "POST",
            body
        });
        if (req.status == 200) {
            let res = await req.json()
            setContent(content => [...content, [1, res.msg]])
            hiddenFileInput.current.value = ''
        } else {
            alert('Проверьте интернет соединение')
        }
    };

    return (
        <div className='globWrapper'>
            <div className="adsMainWrapper">
                <div className="adsSubWrapper">
                    <div className="adsNewWrapper">
                        <div className="mb20">
                            <div className="mobPaddingLR10">
                                <span>Размер баннера должен быть 660х370px</span>
                            </div>
                            <img className="sampleImg" src={`/images/banner/sample.png`} />
                        </div>
                        <div>
                            <input ref={hiddenFileInput} type="file" accept=".jpg, .jpeg, .png" onChange={uploadToClient} style={{ display: 'none' }} />
                            <Form className="w-100">
                                <div className="mb20 mobPaddingLR10">
                                    <div className="inputField">
                                        <div className="simpleInput">
                                            <textarea placeholder="ИНН организации" maxLength="20" onChange={(e) => { setTitle(e.target.value) }}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb20 mobPaddingLR10">
                                    <FormControl fullWidth>
                                        <InputLabel>Категория</InputLabel>
                                        <Select
                                            value={tag}
                                            label="Категория"
                                            onChange={handleChange}
                                            MenuProps={{
                                                disableScrollLock: true,
                                            }}
                                            sx={{ background: '#fff' }}
                                        >
                                            {
                                                value.map((item, index) => {
                                                    return (
                                                        <MenuItem key={'cats' + index} value={item}>{item}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="mb20 mobPaddingLR10">
                                    <div className="inputField">
                                        {
                                            content.map((item, i) => {
                                                return (
                                                    <img key={'cnt' + i.toString()} className="postImg" src={`/files/normal/${item[1]}`} onClick={() => { handleOpen(item[1]) }} />
                                                )
                                            })
                                        }

                                        {content.length >= 1 ? null
                                            :
                                            <div className="addPostBtns">
                                                <div className="addPostBtn" onClick={() => { addPostModule(1) }}><div className='actionBtnChild'><i className="fas fa-image" /></div></div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="mobPaddingLR10">
                                    <button className="bigBlueButton fullWidthBBB" onClick={(e) => { dobavitPost(e) }}>Отправить на рассмотрение</button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}


export async function getServerSideProps(ctx) {
    const parsedCookies = cookies(ctx);
    if (typeof parsedCookies.token != 'undefined') {
        return {
            props: {
                token: parsedCookies.token
            }
        }
    } else {
        return {
            redirect: {
                destination: `/auth?l=${ctx.resolvedUrl}`,
            },
        }
    }
}