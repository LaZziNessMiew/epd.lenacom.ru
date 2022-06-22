import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/router";
import $ from "jquery";
import Link from 'next/link'
// frontend-cookies
import Cookies from 'js-cookie';

//redux snackbar
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../../stores/snackBarSlice";

export default function ForumTagPost(props) {
    const item = props.post
    const router = useRouter()

    const [comments, setComments] = useState(props.comments)
    const [content, setContent] = useState('')
    const [replyComId, setReplyComId] = useState(false)
    const [replyBox, showReplyBox] = useState({ to: '', open: false })
    const dispatch = useDispatch(); //redux

    const scrollTop = (el) => {
        if (el != 0) {
            el = $(`#${el}`).position().top
        }
        window.scrollTo({
            top: el,
            behavior: "instant"
        });
    }
    useEffect(() => {
        scrollTop(0)
        //Счетчик просмотров
        let viewedIds = Cookies.get('MK5rmnZc3z')
        if (viewedIds) {
            if (!viewedIds.includes(`f${props.pid}`)) {
                Cookies.set('MK5rmnZc3z', viewedIds + `f${props.pid}`, { expires: 1 })
                dobavitProsmotr()
            }
        } else {
            Cookies.set('MK5rmnZc3z', `f${props.pid}`, { expires: 1 })
            dobavitProsmotr()
        }
    }, [])

    const dobavitComment = async () => {
        let req = await fetch(`${props.url}/api/forum/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: Cookies.get('token'),
                postId: props.pid,
                content,
                replyComId
            })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            if (req.status == 200) {
                //обновить секцию комментариев	
                let reqComments = await fetch(`${props.url}/api/forum/comments?postId=${props.pid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }); let resComments
                if (reqComments.status == 200) { resComments = await reqComments.json() }
                else { resComments = { data: [] } }
                setContent("")
                $('#commentTextAreaSolo').val('')
                $('#commentTextArea').val('')
                setComments(resComments.data)
            }
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux
    }

    const dobavitProsmotr = async () => {
        let req = await fetch(`${props.url}/api/forum/posts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: props.pid,
                viewed: true
            })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
        } else {
            msg = 'Проверьте интернет соединение'
            dispatch(setSnackBarData({ text: msg, show: true })); //redux
        }
    }

    const goTo = async (link) => {
        router.push(link)
    }

    //EPD нажать лайк или дизлайк на кнопку
    const doPostCommentAction = async (e, action, commentId) => {
        e.preventDefault()
        let req = await fetch(`${props.url}/api/forum/comments`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: Cookies.get('token'),
                commentId,
                updateVote: action == 'like' ? true : action == 'dislike' ? false : null
            })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            if (req.status == 200) {
                //обновить секцию комментариев	
                let reqComments = await fetch(`${props.url}/api/forum/comments?postId=${props.pid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }); let resComments
                if (reqComments.status == 200) { resComments = await reqComments.json() }
                else { resComments = { data: [] } }
                setComments(resComments.data)
            }
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux
    }
    //Растущие текстовые поля при вводе
    const inputFldGrower = async (e) => {
        e.target.parentElement.dataset.replicatedValue = e.target.value
    }

    const reply = async (e, id) => {
        showReplyBox({ to: id, open: true })
    }

    const commentElement = (item) => {
        return (

            < div
                key={item.id}
                className={item.nest_lvl == 0 ? 'palataComment' : 'palataCommentNested'}
            >
                <div className='commentTitle'><span className="fontBold">{item.author}</span>, {item.create_date}</div>
                <div className='commentContent'>{item.content}</div>
                <div className='footerPost'>
                    <div className='actionBtnArea'>
                        <div className='actionBtnCommendPost actionBtnPointer pointer' onClick={(e) => { doPostCommentAction(e, 'like', item.id) }}><div className='actionBtnChild'><i className="fas fa-thumbs-up fa-sm"></i><span>{item.upvote}</span></div></div>
                        <div className='actionBtnCommendPost actionBtnPointer pointer' onClick={(e) => { doPostCommentAction(e, 'dislike', item.id) }}><div className='actionBtnChild'><i className="fas fa-thumbs-down fa-sm"></i><span>{item.downvote}</span></div></div>
                        <div className='actionBtnCommendPost actionBtnPointer pointer' onClick={(e) => { reply(e, item.id) }}><div className='actionBtnChild'><i className="fas fa-reply fa-sm"></i><span className="actionBtnChildPadding">{'Ответить'}</span></div></div>
                    </div>

                    {(replyBox.to == item.id && replyBox.open == true) ?
                        <div className="palataCommentML">
                            {props.token != false ?
                                <>
                                    <div className="inputField mt-3">
                                        <div className="grow-wrap">
                                            <textarea id="commentTextArea" placeholder="Написать комментарий" onChange={(e) => { inputFldGrower(e), setContent(e.target.value), setReplyComId(item.id) }}></textarea>
                                            <div className="grow-wrap-buttons">
                                                <button className="bigBlueButton" onClick={dobavitComment}>Отправить</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : null
                            }
                        </div>
                        : null
                    }
                    {Object.keys(item.nest).map((subItem) => {
                        return (
                            commentElement(item.nest[subItem])
                        )
                    })}
                </div>
            </div >
        )
    }

    return (
        <div className='globWrapper'>
            <div className="forumMainWrapper">
                <div className="forumSubWrapper">
                    <div
                        key={item.id}
                        id={item.id}
                        name={item.id}
                        className='palataPost'
                    >
                        <div id={'hiderPost' + item.id} className={item.content.length == 0 ? "palataPostHideContent" : null}>
                            <div className='padding10TRL'>
                                <Link href={`/forum/${props.nametag}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <b><span>{item.tagName}</span></b>
                                    </a>
                                </Link>
                                <span className="iconGrayColor">{', '}{item.author}</span>
                            </div>
                            <div className='titlePost actionBtnPointer padding10TRL'>
                                <span>{item.title}</span>
                            </div>

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
                        {item.content.length == 0 ?
                            <div id={'hiderBtn' + item.id} className="palataShowFull noselect" onClick={(e) => { handleShowFull(e, item.id) }}>
                                <span>Показать полностью</span>
                            </div> : null}
                        <div className='tagsPost'>
                            {item.tagsId}
                        </div>

                        <div className='padding10TRL'>
                            <div className='actionBtnArea'>
                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                <div className='newsPostInfo floatR'>{item.create_date}</div>
                            </div>
                        </div>
                    </div>

                    {/*Написать комментарий*/}
                    <div>
                        {(props.token != false && !replyBox.open) ?
                            <>
                                <div className="inputField mb10">
                                    <div className="grow-wrap">
                                        <textarea id="commentTextAreaSolo" placeholder="Написать комментарий" onChange={(e) => { inputFldGrower(e), setContent(e.target.value) }}></textarea>
                                        <div className="grow-wrap-buttons">
                                            <button className="bigBlueButton" onClick={(e) => { dobavitComment(e, item.id, item.user_id) }}>Отправить</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : null
                        }
                    </div>
                    {/*Список комментариев*/}


                    {comments.length == 0 ?
                        <div className="centerText">Нет комментариев</div>
                        :
                        Object.keys(comments).map((item) => {
                            return (
                                commentElement(comments[item])
                            )
                        })
                    }
                </div>
            </div >
        </div >
    )
}

export async function getServerSideProps(ctx) {
    const pid = ctx.query;
    let reqPost = await fetch(`${process.env.STRURL}/api/forum/posts?postId=${pid.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let reqComments = await fetch(`${process.env.STRURL}/api/forum/comments?postId=${pid.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let resComments
    //get post info
    if (reqPost.status == 200) {
        let resPost = await reqPost.json()
        if (reqComments.status == 200) {
            resComments = await reqComments.json()
        } else {
            resComments = {
                data: []
            }
        }
        return {
            props: {
                url: process.env.STRURL,
                pid: pid.id,
                post: resPost.data,
                comments: resComments.data,
                nametag: ctx.resolvedUrl.split('/')[2]
            }
        }
    } else {
        return { notFound: true }
    }
}
