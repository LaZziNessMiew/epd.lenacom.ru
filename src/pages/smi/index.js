import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import $ from "jquery";
import Link from 'next/link'
import Head from 'next/head'

//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice"
import { mathCeilUp } from "../../middleware/etc"

var limitPost = 30
var memPostY = 0

export default function NewsIndex(props) {
    const router = useRouter()
    const [posts, setPosts] = useState(props.posts.data)
    const [contentLoaded, setContentLoaded] = useState(false)
    const dispatch = useDispatch(); //redux

    const scrollTop = (el) => {
        if (el != 0) {
            try {
                el = $(`#${el}`).position().top
            } catch (err) {
                el = 0
            }
        }
        window.scrollTo({
            top: el,
            behavior: "instant"
        });
    }
    //Обновить контент при изменении страницы
    useEffect(() => {
        setPosts(props.posts.data)
        setContentLoaded(props.cond)
    }, [props])
    //если контент загружен то отправить наверх
    useEffect(() => {
        setContentLoaded(false)
        scrollTop(0)
    }, [contentLoaded])
    //доскроллить страницу до последнего поста
    useEffect(() => {
        scrollTop(memPostY)
    }, [])

    const goTo = (link, id) => {
        if (id) {
            memPostY = id
        }
        if (link.split('?')[1]) {
            if (link.split('?')[1].slice(0, 1) == 's') {
                memPostY = 0
            }
        }
        if (link == `/smi/?s=1`) {
            router.push(`/smi`)
        } else {
            router.push(link)
        }
    }

    return (
        <div className='globWrapper'>
            <Head>
                <title>Лена Новости</title>
            </Head>
            <div className="newsMainWrapper">
                <div className="newsSubWrapper">
                    {posts.length == 0 ?
                        <div className="centerText">Нет записей</div>
                        :
                        <div
                            className='palataPost'
                        >
                            {posts.map((item, index) => {
                                //Блок-поста
                                return (
                                    <div
                                        key={item.id}
                                        id={item.id}
                                    >
                                        <div className="newsPostContainer">
                                            {item.content.map((item, index) => {
                                                return (
                                                    item[0] == 1 ?
                                                        <div key={'block' + index} className='newsPostLeft'>
                                                            <img key={'img' + index.toString()} className="newsPostImg" src={`/files/normal/${item[1]}`} />
                                                        </div>
                                                        :
                                                        null
                                                )
                                            })}
                                            <div className="newsPostRight">
                                                <Link className="headerTBlockTop" href={`/smi/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                                    <a>
                                                        <div className='newsPostTitle pointer' onClick={() => { goTo(`/smi/${item.id}`, item.id) }}>
                                                            <span >{item.title}</span>
                                                        </div>
                                                    </a>
                                                </Link>
                                                <div className='infoPost'>
                                                    <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                                    <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                                    <div className='newsPostInfo margin15R floatR'>{item.create_date}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {index != posts.length - 1 ? <div className="newsBorder" /> : null}
                                    </div>
                                )
                            })}
                        </div>
                    }


                    {/*Навигатор страниц*/}
                    {posts.length != 0 ? <div className="actionBtnArea actionBtnPageNavArea">
                        {(props.postsCount == 0) ?
                            null
                            :
                            <>
                                {props.page == 1 ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi/?s=${props.page - 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-left"></i></span></div></div>}
                                {
                                    props.postsCount > limitPost * 7 //10 кнопок страниц показывать
                                        ?
                                        mathCeilUp(props.postsCount, limitPost) - 4 < props.page
                                            ?
                                            <>
                                                <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                {[...Array(6).keys()].map((item) => {
                                                    return (
                                                        <div key={item} className={item == parseInt(props.page) + 5 - mathCeilUp(props.postsCount, limitPost) ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/smi/?s=${item + mathCeilUp(props.postsCount, limitPost) - 5}`) }}><div className="actionBtnChild  "><span>{item + mathCeilUp(props.postsCount, limitPost) - 5}</span></div></div>
                                                    )
                                                })}
                                            </>
                                            :
                                            props.page < 5
                                                ?
                                                (
                                                    <>
                                                        {
                                                            [...Array(6).keys()].map((item) => {
                                                                return (
                                                                    <div key={item} className={item == parseInt(props.page) - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/smi/?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                                )
                                                            })
                                                        }
                                                        <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                        {
                                                            [...Array(5).keys()].map((item) => {
                                                                return (
                                                                    <div key={item} className={item == 2 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/smi/?s=${item + parseInt(props.page) - 2}`) }}><div className="actionBtnChild"><span>{item + parseInt(props.page) - 2}</span></div></div>
                                                                )
                                                            })
                                                        }
                                                        <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                    </>
                                                )
                                        :
                                        <>
                                            {
                                                [...Array(mathCeilUp(props.postsCount, limitPost)).keys()].map((item) => {
                                                    return (
                                                        <div key={item} className={item == props.page - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/smi/?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                    )
                                                })
                                            }
                                            {mathCeilUp(props.postsCount, limitPost) > 7 ? <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div> : null}
                                        </>
                                }
                                {props.page == mathCeilUp(props.postsCount, limitPost) ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi/?s=${parseInt(props.page) + 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-right"></i></span></div></div>}
                            </>
                        }
                    </div> : null}
                </div>
            </div >
        </div >
    )
}


export async function getServerSideProps(ctx) {
    let pid
    if (ctx.query.s) {
        pid = { page: ctx.query.s };
    } else {
        pid = { page: 1 };
    }
    //Найти количество всех постов
    let reqCount = await fetch(`${process.env.STRURL}/api/smi/getPostsCount`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let resCount
    if (reqCount.status == 200) {
        resCount = await reqCount.json()
    } else {
        resCount = { data: 0 }
    }
    //Найти все посты c offset
    let reqPosts = await fetch(`${process.env.STRURL}/api/smi/posts?limit=${limitPost}&offset=${(pid.page - 1) * limitPost}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let resPosts
    if (reqPosts.status == 200) {
        resPosts = await reqPosts.json()
    } else {
        resPosts = { data: [] }
    }
    return {
        props: {
            url: process.env.STRURL,
            postsCount: resCount.data,
            posts: resPosts,
            page: pid.page,
            cond: true,
        }
    }
}