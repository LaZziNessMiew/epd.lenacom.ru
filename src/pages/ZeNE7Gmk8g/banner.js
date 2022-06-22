import React, { useEffect, useState } from 'react';
import cookies from 'next-cookies'
import Button from 'react-bootstrap/Button'
import { convertStampDate } from '../../middleware/formats'
//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice"
import { mathCeilUp } from "../../middleware/etc"

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function AdsPost(props) {
    const [posts, setPosts] = useState(props.posts.data)
    const dispatch = useDispatch(); //redux
    const doPostAction = async (e, postId, token) => {
        e.preventDefault()
        let req = await fetch(`${props.url}/api/sponsor/posts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                postId,
            })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux
    }
    return (
        <div className='globWrapper'>
            <div className='palataMainWrapper'>
                <div className="palataSubWrapper">
                    {posts.length == 0 ? <div className="centerText">Нет записей</div> : posts.map((item) => {
                        return (
                            <div className="mainAdsAdmin"
                                key={'mainAdsAdmin' + item}
                            >
                                <div
                                    key={item.id}
                                    className='palataPost'
                                >
                                    <div className="padding10TRL"><span>name: {item.name}</span></div>
                                    <div className="padding10RL"><span>tag: {item.tag}</span></div>
                                    <div className="padding10RBL"><span>Дата отправки: {convertStampDate(item.create_date)}</span></div>
                                    {item.content.map((item, index) => {
                                        return (
                                            <div key={item}>
                                                <img key={'img'} className="postImg" src={`/files/normal/${item[1]}`} />
                                            </div>
                                        )
                                    })}
                                    <div className="padding10TRBL">
                                        <Container fluid="md" className="p-0">
                                            <Row>
                                                <Col>
                                                    <button className="bigBlueButton fullWidth" onClick={(e) => { doPostAction(e, item.id, props.token) }}>Одобрить</button>
                                                </Col>
                                                <Col>
                                                    <button className="bigBlueButton fullWidth grayColor" onClick={(e) => { smenitPageRegister(e) }}>Отклонить</button>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(ctx) {
    const parsedCookies = cookies(ctx);
    let req = await fetch(`${process.env.STRURL}/api/sponsor/posts?active=false`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let res
    if (req.status == 200) {
        res = await req.json()
    } else {
        res = { data: [] }
    }
    return {
        props: {
            posts: res,
            token: parsedCookies.token,
            url: process.env.STRURL
        }
    }
}