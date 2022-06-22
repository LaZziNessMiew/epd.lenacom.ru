import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import $ from "jquery";
import Link from 'next/link'
import Head from 'next/head'

import { mathCeilUp } from "../../middleware/etc"

var limitPost = 30
var memPostY = 0

export default function ForumTag(props) {
    const router = useRouter()
    const [posts, setPosts] = useState(props.posts.data)
    const [contentLoaded, setContentLoaded] = useState(false)

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
        if (link == `/poleznoe?s=1`) {
            router.push(`/poleznoe`)
        } else {
            router.push(link)
        }
    }

    return (
        <div className='globWrapper'>
            <Head>
                <title>Лена Полезное</title>
            </Head>
            <div className='forumMainWrapper'>
                <div className='forumSubWrapper'>
                    <div className="forumChildContent">
                        <Link href={`/poleznoe`} onClick={(e) => { e.preventDefault() }} passHref>
                            <a>
                                <div className='titleForum'>
                                    <b>{'Полезное'}</b>
                                </div>
                            </a>
                        </Link>
                        <div className='outlineForum iconGrayColor'>
                            <div className='tableForum' style={{ textAlign: 'left', width: '60%' }}>Тема </div>
                            <div className='tableForum' style={{ width: '20%' }}>Автор</div>
                            <div className='tableForum'>Отв.</div>
                            <div className='tableForum'>Соз.</div>
                        </div>
                        {
                            posts.length == 0 ? <div className="error404PT centerText">Здесь пока пусто</div> : posts.map((item) => {
                                //Блок темы
                                return (
                                    <Link key={item.id} href={`/forum/${item.tag}/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div
                                                className='forumPost'
                                                onClick={() => { goTo(`/forum/${item.tag}/${item.id}`) }}
                                            >
                                                <div className='tableForum' style={{ textAlign: 'left', width: '60%' }}>{item.title}</div>
                                                <div className='tableForum' style={{ width: '20%' }}>{item.author}</div>
                                                <div className='tableForum iconGrayColor'><i className="far fa-comment-alt-lines fa-sm"></i><span>{' ' + item.comments}</span></div>
                                                <div className='tableForum iconGrayColor'><span>{item.create_date}</span></div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })
                        }

                    </div>
                    {/*Навигатор страниц*/}
                    {
                        posts.length != 0 ? <div className="actionBtnArea actionBtnPageNavArea">
                            {(props.postsCount == 0) ?
                                null
                                :
                                <>
                                    {props.page == 1 ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/poleznoe?s=${props.page - 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-left"></i></span></div></div>}
                                    {
                                        props.postsCount > limitPost * 7 //10 кнопок страниц показывать
                                            ?
                                            mathCeilUp(props.postsCount, limitPost) - 4 < props.page
                                                ?
                                                <>
                                                    <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                    {[...Array(6).keys()].map((item) => {
                                                        return (
                                                            <div key={item} className={item == parseInt(props.page) + 5 - mathCeilUp(props.postsCount, limitPost) ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/poleznoe?s=${item + mathCeilUp(props.postsCount, limitPost) - 5}`) }}><div className="actionBtnChild  "><span>{item + mathCeilUp(props.postsCount, limitPost) - 5}</span></div></div>
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
                                                                        <div key={item} className={item == parseInt(props.page) - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/poleznoe?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                                    )
                                                                })
                                                            }
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/poleznoe?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/smi`) }}><div className="actionBtnChild"><span>{1}</span></div></div>
                                                            {
                                                                [...Array(5).keys()].map((item) => {
                                                                    return (
                                                                        <div key={item} className={item == 2 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/poleznoe?s=${item + parseInt(props.page) - 2}`) }}><div className="actionBtnChild"><span>{item + parseInt(props.page) - 2}</span></div></div>
                                                                    )
                                                                })
                                                            }
                                                            <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/poleznoe?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div>
                                                        </>
                                                    )
                                            :
                                            <>
                                                {
                                                    [...Array(mathCeilUp(props.postsCount, limitPost)).keys()].map((item) => {
                                                        return (
                                                            <div key={item} className={item == props.page - 1 ? "actionBtnPageNav actionBtnActive" : "actionBtnPageNav"} onClick={() => { goTo(`/poleznoe?s=${item + 1}`) }}><div className="actionBtnChild"><span>{item + 1}</span></div></div>
                                                        )
                                                    })
                                                }
                                                {mathCeilUp(props.postsCount, limitPost) > 7 ? <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/poleznoe?s=${mathCeilUp(props.postsCount, limitPost)}`) }}><div className="actionBtnChild"><span>{mathCeilUp(props.postsCount, limitPost)}</span></div></div> : null}
                                            </>
                                    }
                                    {props.page == mathCeilUp(props.postsCount, limitPost) ? null : <div className="actionBtnPageNav actionBtnLight" onClick={() => { goTo(`/poleznoe?s=${parseInt(props.page) + 1}`) }}><div className="actionBtnChild"><span><i className="fas fa-caret-right"></i></span></div></div>}
                                </>
                            }
                        </div> : null
                    }
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(ctx) {
    //pid - номер текущей страницы
    let pid; if (ctx.query.s) { pid = { page: ctx.query.s }; } else { pid = { page: 1 }; }
    //Найти количество всех записей
    let reqCount = await fetch(`${process.env.STRURL}/api/poleznoe/posts?count=true`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let resCount
    if (reqCount.status == 200) {
        resCount = await reqCount.json()
    } else {
        resCount = { data: 0 }
    }
    //Найти все записи с атрибутом poleznoe: true
    let reqPosts = await fetch(`${process.env.STRURL}/api/poleznoe/posts?limit=${limitPost}&offset=${(pid.page - 1) * limitPost}`, {
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
            page: pid.page,
            postsCount: resCount.data,
            posts: resPosts,
            cond: true, //оптравить информацию о том, что всё успешно загружено
        }
    }

}