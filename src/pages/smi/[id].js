import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/router";
import $ from "jquery";
//backend-cookies
import cookies from 'next-cookies'
//frontend-cookies
import Cookies from 'js-cookie';

//redux snackbar
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../../stores/snackBarSlice";

export default function SmiId(props) {
    const router = useRouter()
    const [comments, setComments] = useState(props.comments)
    const [content, setContent] = useState('')
    const [replyComId, setReplyComId] = useState(false)
    const [replyBox, showReplyBox] = useState({ to: '', open: false })
    var allowEmotes = false
    const [emotes, setEmotes] = useState(
        [[parseInt(props.post.emote1), 0], [parseInt(props.post.emote2), 0], [parseInt(props.post.emote3), 0], [parseInt(props.post.emote4), 0], [parseInt(props.post.emote5), 0]]
    )
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
        if (props.viewedIds != '') {
            let viewedIdsArr = props.viewedIds.split(/e|_/)
            let viewedIdsIndex = viewedIdsArr.indexOf(`${props.pid}`)
            if (viewedIdsIndex != -1) {
                setEmotes(emotes => {
                    return [
                        ...emotes.slice(0, (parseInt(viewedIdsArr[viewedIdsIndex + 1]) - 1)),
                        [emotes[(parseInt(viewedIdsArr[viewedIdsIndex + 1]) - 1)][0], 1],
                        ...emotes.slice((parseInt(viewedIdsArr[viewedIdsIndex + 1]) - 1) + 1),
                    ]
                })
            } else {
                allowEmotes = true
            }
        } else {
            allowEmotes = true
        }

        scrollTop(0)
        //Счетчик просмотров
        let viewedIds = Cookies.get('hSFhCdB34v')
        if (viewedIds) {
            let vewedIdsArr = viewedIds.split('n')
            if (!vewedIdsArr.includes(`${props.pid}`)) {
                Cookies.set('hSFhCdB34v', viewedIds + `n${props.pid}`, { expires: 1 })
                dobavitProsmotr()
            }
        } else {
            Cookies.set('hSFhCdB34v', `n${props.pid}`, { expires: 1 })
            dobavitProsmotr()
        }
    }, [])

    const dobavitComment = async (e, itemId, userId) => {
        let req = await fetch(`${props.url}/api/smi/comments`, {
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
                let reqComments = await fetch(`${props.url}/api/smi/comments?postId=${props.pid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }); let resComments
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
        let req = await fetch(`${props.url}/api/smi/posts`, {
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

    //EDK нажать лайк или дизлайк на кнопку
    const doPostAction = async (e, action, postId) => {
        e.preventDefault()
        if (allowEmotes) {
            let req = await fetch(`${props.url}/api/smi/posts`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    updateVote: action
                })
            })
            let msg
            if (req.status != 502) {
                let res = await req.json()
                msg = res.msg
                if (req.status == 200) {
                    allowEmotes = false
                    Cookies.set('B25hhgQvTh', props.viewedIds + `e${props.pid}_${action}`, { expires: 1 })
                    setEmotes(emotes => {
                        return [
                            ...emotes.slice(0, (action - 1)),
                            [emotes[(action - 1)][0] + 1, 1],
                            ...emotes.slice((action - 1) + 1),
                        ]
                    })
                }
            } else {
                msg = 'Проверьте интернет соединение'
            }
            dispatch(setSnackBarData({ text: msg, show: true })); //redux
        } else {
            dispatch(setSnackBarData({ text: 'Вы уже проголосовали', show: true })); //redux
        }
    }

    //EPD нажать лайк или дизлайк на кнопку
    const doPostCommentAction = async (e, action, commentId, userId) => {
        e.preventDefault()
        let req = await fetch(`${props.url}/api/smi/comments`, {
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
                let reqComments = await fetch(`${props.url}/api/smi/comments?postId=${props.pid}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }); let resComments
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
                        <div className='actionBtnCommendPost actionBtnPointer pointer' onClick={(e) => { doPostCommentAction(e, 'like', item.id, item.user_id) }}><div className='actionBtnChild'><i className="fas fa-thumbs-up fa-sm"></i><span>{item.upvote}</span></div></div>
                        <div className='actionBtnCommendPost actionBtnPointer pointer' onClick={(e) => { doPostCommentAction(e, 'dislike', item.id, item.user_id) }}><div className='actionBtnChild'><i className="fas fa-thumbs-down fa-sm"></i><span>{item.downvote}</span></div></div>
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
                                                <button className="bigBlueButton" onClick={(e) => { dobavitComment(e, item.id, item.user_id) }}>Отправить</button>
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
            <div className="palataMainWrapper">
                <div className="palataSubWrapper">
                    <div
                        key={props.post.id}
                        className='palataPost'
                    >
                        <div className='titlePost padding10TRL'>
                            {props.post.title}
                        </div>

                        {props.post.content.map((item, index) => {
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

                        <div className='smilePost padding10RL noselect'>
                            <div className={emotes[0][1] == 1 ? 'smilePostIcons smilePostIconActive left-edge' : 'smilePostIcons left-edge'} onClick={(e) => { doPostAction(e, 1, props.post.id) }}>
                                &#128516;
                                <span>{emotes[0][0]}</span>
                            </div>
                            <div className={emotes[1][1] == 1 ? 'smilePostIcons smilePostIconActive left-edge' : 'smilePostIcons left-edge'} onClick={(e) => { doPostAction(e, 2, props.post.id) }}>
                                &#128545;
                                <span>{emotes[1][0]}</span>
                            </div>
                            <div className={emotes[2][1] == 1 ? 'smilePostIcons smilePostIconActive left-edge' : 'smilePostIcons left-edge'} onClick={(e) => { doPostAction(e, 3, props.post.id) }}>
                                &#128558;
                                <span>{emotes[2][0]}</span>
                            </div>
                            <div className={emotes[3][1] == 1 ? 'smilePostIcons smilePostIconActive left-edge' : 'smilePostIcons left-edge'} onClick={(e) => { doPostAction(e, 4, props.post.id) }}>
                                &#128549;
                                <span>{emotes[3][0]}</span>
                            </div>
                            <div className={emotes[4][1] == 1 ? 'smilePostIcons smilePostIconActive left-edge' : 'smilePostIcons left-edge'} onClick={(e) => { doPostAction(e, 5, props.post.id) }}>
                                &#129300;
                                <span>{emotes[4][0]}</span>
                            </div>
                        </div>

                        <div className='padding10TRL'>
                            <div className='actionBtnArea'>
                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{props.post.comments}</span></div></div>
                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{props.post.views}</span></div></div>
                                <div className='newsPostInfo floatR'>{props.post.create_date}</div>
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
                                            <button className="bigBlueButton" onClick={dobavitComment}>Отправить</button>
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
    const parsedCookies = cookies(ctx);
    let token, viewedIds
    if (parsedCookies.token) { token = parsedCookies.token } else { token = false }
    if (parsedCookies.B25hhgQvTh) { viewedIds = parsedCookies.B25hhgQvTh } else { viewedIds = '' }

    let reqPost = await fetch(`${process.env.STRURL}/api/smi/posts?postId=${pid.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let reqComments = await fetch(`${process.env.STRURL}/api/smi/comments?postId=${pid.id}`, {
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
                token: token,
                viewedIds: viewedIds,
            }
        }
    } else {
        return { notFound: true }
    }
}
