import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from "next/router";

// bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice";
//cookies
import cookies from 'next-cookies'

export default function PalataNew(props) {
    //refs
    const hiddenFileInput = useRef(null);
    //states
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState([])
    const dispatch = useDispatch(); //redux

    //Растущие текстовые поля при вводе
    const inputFldGrower = async (e) => {
        e.target.parentElement.dataset.replicatedValue = e.target.value
    }

    //Добавить пост
    const dobavitPost = async (e) => {
        e.preventDefault()
        let req = await fetch(`/api/smi/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: props.token, title, content })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            if (req.status == 200) {
                router.push('/smi')
            }
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux        
    }

    //модульная система постов
    const addPostModule = (val) => {
        if (val == 0) { //текст
            setContent(content => [...content, [val, '']])
        } else if (val == 1) { //изображение
            hiddenFileInput.current.click();
        }
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
            <div className="palataMainWrapper">
                <div className="palataSubWrapper">
                    <input ref={hiddenFileInput} type="file" accept=".jpg, .jpeg, .png" onChange={uploadToClient} style={{ display: 'none' }} />
                    <Form className="w-100">
                        <div className="mb20 mobPaddingLR10">
                            <div className="inputField">
                                <div className="grow-wrap">
                                    <textarea name="text" id="text" placeholder="Заголовок" maxLength="150" onChange={(e) => { inputFldGrower(e), setTitle(e.target.value) }}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="mb20 mobPaddingLR10">
                            <div className="inputField">
                                {
                                    content.map((item, i) => {
                                        return (
                                            item[0] == 0 ?
                                                <div key={'cnt' + i.toString()} className="grow-wrap">
                                                    <textarea
                                                        placeholder="Новый абзац" defaultValue={item[1]} onChange={(e) => {
                                                            inputFldGrower(e),
                                                                setContent(content => {
                                                                    return [
                                                                        ...content.slice(0, i),
                                                                        [item[0], e.target.value],
                                                                        ...content.slice(i + 1),
                                                                    ]
                                                                })
                                                        }}
                                                    ></textarea>
                                                </div>
                                                :
                                                <img key={'cnt' + i.toString()} className="postImg" src={`/files/normal/${item[1]}`} />

                                        )
                                    })
                                }
                                <div className="addPostBtns">
                                    <div className="addPostBtn" onClick={() => { addPostModule(0) }}><div className='actionBtnChild'><i className="fas fa-text" /></div></div>
                                    <div className="addPostBtn" onClick={() => { addPostModule(1) }}><div className='actionBtnChild'><i className="fas fa-image" /></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="mobPaddingLR10">
                            <button className="bigBlueButton fullWidthBBB" onClick={(e) => { dobavitPost(e) }}>Добавить новость</button>
                        </div>
                    </Form>

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