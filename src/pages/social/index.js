import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import $ from "jquery";
import Link from 'next/link'
import Head from 'next/head'
// front-cookies
import Cookies from 'js-cookie';

//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice"
import { mathCeilUp } from "../../middleware/etc"

var limitPost = 30
var memPostY = 0

export default function PalataIndex(props) {
    const router = useRouter()
    const [posts, setPosts] = useState(props.posts.data)
    const [contentLoaded, setContentLoaded] = useState(false)
    const dispatch = useDispatch(); //redux

    const handleShowFull = async (e, id) => {
        e.preventDefault()
        $('#hiderPost' + id).removeClass('palataPostHideContent')
        $('#hiderBtn' + id).addClass('hidden')
    }

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
        if (link == `/social/?s=1`) {
            router.push(`/social`)
        } else {
            router.push(link)
        }
    }

    //EDK нажать лайк или дизлайк на кнопку
    const doPostAction = async (e, action, postId) => {
        e.preventDefault()
        let req = await fetch(`${props.url}/api/social/posts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: Cookies.get('token'),
                postId,
                updateVote: action == 'like' ? true : action == 'dislike' ? false : null
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
            <Head>
                <title>Лена Соцсети</title>
            </Head>
            <div className="palataMainWrapper">
                <div className="palataSubWrapper">
                    {posts.length == 0 ? <div className="centerText">Нет записей</div> : posts.map((item) => {
                        //Блок-поста

                        return (
                            <div
                                key={item.id}
                                id={item.id}
                                className='palataPost'
                            >
                                <div id={'hiderPost' + item.id} className={item.content.length == 0 ? "palataPostHideContent" : null}>

                                    <Link className="headerTBlockTop" href={`/social/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div className='titlePost actionBtnPointer padding10TRL pointer' onClick={() => { goTo(`/social/${item.id}`, item.id) }}>
                                                <span >{item.title}</span>
                                            </div>
                                        </a>
                                    </Link>

                                    {item.content.map((item, index) => {
                                        return (
                                            item[0] == 0 ?
                                                <div key={'block' + index} className='contentPost padding10RL'>
                                                    {item[1]}
                                                </div>
                                                :
                                                <div key={'block' + index} className='contentPost'>
                                                    <img key={'img' + index.toString()} className="postImg" src={`/files/normal/${item[1]}`} />
                                                </div>
                                        )
                                    })}
                                </div>
                                {
                                    item.content.length == 0 ?
                                        <div id={'hiderBtn' + item.id} className="palataShowFull noselect" onClick={(e) => { handleShowFull(e, item.id) }}>
                                            <span>Показать полностью</span>
                                        </div> : null
                                }
                                <div className='tagsPost'>
                                    {item.tagsId}
                                </div>
                                <div className='padding10RL'>
                                    <div className='actionBtnArea'>
                                        <div className='actionBtnCommendPost pointer' onClick={(e) => { doPostAction(e, 'like', item.id) }}><div id={'upvoteBtn' + item.id} className='actionBtnChild'><i className="fas fa-thumbs-up fa-sm"></i><span>{item.upvote}</span></div></div>
                                        <div className='actionBtnCommendPost pointer' onClick={(e) => { doPostAction(e, 'dislike', item.id) }}><div className='actionBtnChild'><i className="fas fa-thumbs-down fa-sm"></i><span>{item.downvote}</span></div></div>
                                    </div>
                                </div>

                                <div className='padding10TRL'>
                                    <div className='actionBtnArea'>
                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                        <div className='newsPostInfo floatR'>{item.create_date}</div>
                                    </div>
                                </div>
                            </div >
                        )
                    })}

                    {/*Навигатор страниц*/}
                    {
                        posts.length != 0 ? <div className="actionBtnArea actionBtnPageNavArea">
                            {(props.postsCount == 0) ?
                                null
                                :
                                <>
                                    {props.page == 1 ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social/?s=${props.page - 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-left"></i></span></div></div>}
                                    {
                                        props.postsCount > limitPost * 7 //10 кнопок страниц показывать
                                            ?
                                            mathCeilUp(props.postsCount, limitPost) - 4 < props.page
                                                ?
                                                <>
                                                    <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                    {[...Array(6).keys()].map((item) => {
                                                        return (
                                                            <div key={item} className={item == parseInt(props.page) + 5 - mathCeilUp(props.postsCount, limitPost) ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/social/?s=${item + mathCeilUp(props.postsCount, limitPost) - 5}`) }}><div className="actionBtnChild  "><span>{item + mathCeilUp(props.postsCount, limitPost) - 5}</span></div></div>
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
                                                                        <div key={item} className={item == parseInt(props.page) - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/social/?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                                    )
                                                                })
                                                            }
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                            {
                                                                [...Array(5).keys()].map((item) => {
                                                                    return (
                                                                        <div key={item} className={item == 2 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/social/?s=${item + parseInt(props.page) - 2}`) }}><div className="actionBtnChild"><span>{item + parseInt(props.page) - 2}</span></div></div>
                                                                    )
                                                                })
                                                            }
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                        </>
                                                    )
                                            :
                                            <>
                                                {
                                                    [...Array(mathCeilUp(props.postsCount, limitPost)).keys()].map((item) => {
                                                        return (
                                                            <div key={item} className={item == props.page - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/social/?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                        )
                                                    })
                                                }
                                                {mathCeilUp(props.postsCount, limitPost) > 7 ? <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social/?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div> : null}
                                            </>
                                    }
                                    {props.page == mathCeilUp(props.postsCount, limitPost) ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/social/?s=${parseInt(props.page) + 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-right"></i></span></div></div>}
                                </>
                            }
                        </div> : null
                    }
                </div >
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
    let reqCount = await fetch(`${process.env.STRURL}/api/social/getPostsCount`, {
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
    let reqPosts = await fetch(`${process.env.STRURL}/api/social/posts?limit=${limitPost}&offset=${(pid.page - 1) * limitPost}`, {
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
            posts: resPosts,
            postsCount: resCount.data,
            url: process.env.STRURL,
            page: pid.page,
            cond: true,
        }
    }
}