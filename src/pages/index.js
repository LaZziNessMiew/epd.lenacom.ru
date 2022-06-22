import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/router";
import Link from 'next/link'
import Head from 'next/head'
//backend-cookies
import cookies from 'next-cookies'
//frontend-cookies
import Cookies from 'js-cookie';

//redux
import { useDispatch } from "react-redux";
import { setSnackBarData } from "../stores/snackBarSlice"

export default function Index(props) {
    const router = useRouter();

    const [smi, setSmi] = useState(props.smi)
    const [social, setSocial] = useState(props.social)
    const [forum, setForum] = useState(props.forum)
    const [poleznoe, setPoleznoe] = useState(props.poleznoe)

    const [weather, setWeather] = useState(props.weather)
    const [yaknet, setYaknet] = useState(props.yaknet)
    const [kursy, setKursy] = useState(props.kursy)
    const [oprosShowResults, setOprosShowResults] = useState(false)
    const dispatch = useDispatch(); //redux

    const questionAction = async (e, index) => {
        e.preventDefault()
        let req = await fetch(`${props.url}/api/opros`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ip: props.ip,
                oprosId: props.opros.id,
                ansId: index
            })
        })
        let msg
        if (req.status != 502) {
            let res = await req.json()
            msg = res.msg
            setOprosShowResults(!oprosShowResults)
        } else {
            msg = 'Проверьте интернет соединение'
        }
        dispatch(setSnackBarData({ text: msg, show: true })); //redux
    }

    return (
        <div className='globWrapper'>
            <Head>
                <title>Ленаком Якутск</title>
            </Head>
            <div className="mainContent">
                <div className="mainChildContent">
                    {/* Row 1 topic blocks*/}
                    <div className="topicBlocksTop">
                        <div className="childrenTBlockTop0 childrenTBlockTop">
                            {typeof smi[0] != 'undefined' ?
                                <Link className="headerTBlockTop" href={`/smi/${smi[0].id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${smi[0].img})` }}>
                                            <div className="headerIndexDayNews">
                                                {smi[0].title.length > 105 ? smi[0].title.slice(0, 105) + "..." : smi[0].title}
                                            </div>
                                            <div className='indexNewsOfTheDayFooter'>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{smi[0].comments}</span></div></div>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{smi[0].views}</span></div></div>
                                                {/*<div className='newsPostInfo margin15R floatR'>{social[0].create_date}</div>*/}
                                            </div>
                                        </div>
                                    </a>
                                </Link >
                                : null
                            }
                        </div>
                        <div className="childrenTBlockTop1 childrenTBlockTop">
                            {typeof social[0] != 'undefined' ?
                                <Link className="headerTBlockTop" href={`/social/${social[0].id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url("${social[0].img}")` }}>
                                            <div className="headerIndexDayNews">
                                                {social[0].title.length > 105 ? social[0].title.slice(0, 105) + "..." : social[0].title}
                                            </div>
                                            <div className='indexNewsOfTheDayFooter'>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{social[0].comments}</span></div></div>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{social[0].views}</span></div></div>
                                            </div>
                                        </div>
                                    </a>
                                </Link >
                                : null
                            }
                        </div>
                        <div className="childrenTBlockTop2 childrenTBlockTop">
                            {typeof forum[0] != 'undefined' ?
                                <Link className="headerTBlockTop" href={`/forum/${forum[0].tag.latin}/${forum[0].id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${forum[0].img})` }}>
                                            <div className="headerIndexDayNews">
                                                {forum[0].title.length > 105 ? forum[0].title.slice(0, 105) + "..." : forum[0].title}
                                            </div>
                                            <div className='indexNewsOfTheDayFooter'>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{forum[0].comments}</span></div></div>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{forum[0].views}</span></div></div>
                                            </div>
                                        </div>
                                    </a>
                                </Link >
                                : null
                            }
                        </div>
                        <div className="childrenTBlockTop3 childrenTBlockTop">
                            {typeof poleznoe[0] != 'undefined' ?
                                <Link className="headerTBlockTop" href={`/forum/${poleznoe[0].tag.latin}/${poleznoe[0].id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${poleznoe[0].img})` }}>
                                            <div className="headerIndexDayNews">
                                                {poleznoe[0].title.length > 105 ? poleznoe[0].title.slice(0, 105) + "..." : poleznoe[0].title}
                                            </div>
                                            <div className='indexNewsOfTheDayFooter'>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{poleznoe[0].comments}</span></div></div>
                                                <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{poleznoe[0].views}</span></div></div>
                                            </div>
                                        </div>
                                    </a>
                                </Link >
                                : null
                            }
                        </div>
                        <div className="childrenTBlockTop4 childrenTBlockTop">
                            <div className="cardTitle">
                                <span>{'Якутск'}</span>
                            </div>
                            <div className="cardContent">
                                <div className="weatherCard">
                                    <div className="weatherCardElImg"><img className="weatherIcon" src={`/images/calendar/cal.png`} /></div><div className="weatherCardElTxt"><span>{weather[0].day}</span></div>
                                    <div className="weatherCardElImg"><img className="weatherIcon" src={`/images/weather/${weather[2].weathers}.png`} /></div><div className="weatherCardElTxt"><span>СЕГОДНЯ {weather[2].temperature}</span></div>
                                    <div className="weatherCardElImg"><img className="weatherIcon" src={`/images/weather/${weather[6].weathers}.png`} /></div><div className="weatherCardElTxt"><span>ЗАВТРА {weather[6].temperature}</span></div>
                                    <div className="weatherCardElImg"><img className="weatherIcon" src={`/images/weather/${weather[10].weathers}.png`} /></div><div className="weatherCardElTxt"><span>ПОСЛЕЗАВТРА {weather[10].temperature}</span></div>
                                    <div className="weatherCardElImg"><img className="weatherIcon" src={`/images/traffic/red.png`} /></div><div className="weatherCardElTxt"><span>ПРОБКИ 10 БАЛЛОВ</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="childrenTBlockTop5 childrenTBlockTop">
                            <div className="cardTitle">
                                <span>{'Опрос'}</span>
                            </div>
                            <div className="oprosContent">
                                <span>{props.opros.title}</span>
                            </div>
                            <div className="oprosQuestion">
                                {
                                    !oprosShowResults ? props.opros.ans.map((item, index) => {
                                        return (
                                            <div key={'oprosAns' + index} className="oprosQuestionStyle" onClick={(e) => { questionAction(e, index) }}>
                                                <span>{item[0]}</span>
                                            </div>
                                        )
                                    })
                                        : props.opros.ans.map((item, index) => {
                                            let calcPercentage = Math.floor((item[1] / props.opros.sum) * 100)
                                            return (
                                                <div key={'oprosAnsRes' + index}>
                                                    <span>{item[0]}: {item[1]} чел. ({calcPercentage}%)</span>
                                                    <div className="oproProgressbar">
                                                        <span style={{ width: `${calcPercentage}%` }}></span>{/*<div key={'oprosAnsPercentage' + index} className="oprosQuestionStyleAns" style={{ background: `linear-gradient(to right, #7EB77E ${calcPercentage}%, #e6f3fc ${100 - calcPercentage}%)`, }}></div>*/}
                                                    </div>
                                                </div>
                                            )
                                        })
                                }
                            </div>
                        </div>
                    </div>
                    {/* Row 2 topic blocks*/}
                    <div className="topicBlocks">
                        <div className="childrenTBlock">
                            <Link className="headerTBlock" href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="headerTBlock">
                                        <span>{'Новости'}</span>
                                    </div>
                                </a>
                            </Link >
                            {smi.map((item, index) => {
                                return (
                                    <Link key={'smiList' + index} className="headerTBlock" href={`/smi/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div className="contentTBlock">
                                                <div className="contentTImg" style={{ backgroundImage: `url(${item.img})` }} />
                                                <div className="contentTTtext">
                                                    {item.title}
                                                    <div className='contentTFooter'>
                                                        <div className='newsPostInfo margin15R iconGrayColor'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="childrenTBlock">
                            <Link className="headerTBlock" href="/social" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="headerTBlock">
                                        <span>{'Соцсети'}</span>
                                    </div>
                                </a>
                            </Link >
                            {social.map((item, index) => {
                                return (
                                    <Link key={'socialList' + index} className="headerTBlock" href={`/social/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div className="contentTBlock">
                                                <div className="contentTImg" style={{ backgroundImage: `url(${item.img})` }} />
                                                <div className="contentTTtext">
                                                    {item.title}
                                                    <div className='contentTFooter'>
                                                        <div className='newsPostInfo margin15R iconGrayColor'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="childrenTBlock">
                            <Link className="headerTBlock" href="/forum" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="headerTBlock">
                                        <span>{'Форумы'}</span>
                                    </div>
                                </a>
                            </Link >
                            {forum.map((item, index) => {
                                return (
                                    <Link key={'forumList' + index} className="headerTBlock" href={`/forum/${item.tag.latin}/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div className="contentTBlock">
                                                <div className="contentTImg" style={{ backgroundImage: `url(${item.img})` }} />
                                                <div className="contentTTtext">
                                                    {item.title}
                                                    <div className='contentTFooter'>
                                                        <div className='newsPostInfo margin15R iconGrayColor'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })}
                        </div>
                        <div className="childrenTBlock">
                            <Link className="headerTBlock" href="/poleznoe" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="headerTBlock">
                                        <span>{'Полезное'}</span>
                                    </div>
                                </a>
                            </Link >
                            {poleznoe.map((item, index) => {
                                return (
                                    <Link key={'poleznoeList' + index} className="headerTBlock" href={`/forum/${item.tag.latin}/${item.id}`} onClick={(e) => { e.preventDefault() }} passHref>
                                        <a>
                                            <div className="contentTBlock">
                                                <div className="contentTImg" style={{ backgroundImage: `url(${item.img})` }} />
                                                <div className="contentTTtext">
                                                    {item.title}
                                                    <div className='contentTFooter'>
                                                        <div className='newsPostInfo margin15R iconGrayColor'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{item.comments}</span></div></div>
                                                        <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{item.views}</span></div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link >
                                )
                            })}
                        </div>
                    </div>
                    {/* Row 3 topic blocks*/}
                    <div className="topicBlocksBottom">
                        <div className="childrenTBlockBottom">
                            <Link className="headerTBlock" href="/yaknet" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="cardTitle">
                                        <span>{'Якнет'}</span>
                                    </div>
                                </a>
                            </Link>
                            <div className="cardContent">
                                <div className="yaknetCard">
                                    <ul>
                                        {
                                            yaknet.map((item, index) => {
                                                return (
                                                    <li key={'yaknet' + index}>
                                                        <Link href={item.link} onClick={(e) => { e.preventDefault() }} passHref>
                                                            <a>
                                                                <span>{item.name}</span>
                                                                <span> - {item.desc}</span>
                                                            </a>
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="childrenTBlockBottom">
                            <div className="cardTitle">
                                <span>{'Курсы'}</span>
                            </div>
                            <div className="cardContent">
                                <div className="dollarCard">
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn fontBold">
                                            <span>{'USD SWIFT'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div
                                                        className="dollarCardColumn"
                                                        key={'dollar' + index}
                                                    >
                                                        <span>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn textCenter fontBold">
                                            <span>{'пок.'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div className="dollarCardColumn textCenter"
                                                        key={'dollar' + index}>
                                                        <span>
                                                            {item.buy} ₽
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn textCenter fontBold">
                                            <span>{'прод.'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div className="dollarCardColumn textCenter"
                                                        key={'dollar' + index}>
                                                        <span>
                                                            {item.sell} ₽
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn dCCPL">
                                        <div className="dollarCardColumn fontBold">
                                            <span>{'USD разное'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumn"
                                                        key={'dollar' + index}>
                                                        <span>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn textCenter fontBold">
                                            <span>{'пок.'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumn textCenter"
                                                        key={'dollar' + index}>
                                                        <span>
                                                            {item.buy} ₽
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn textCenter">
                                        <div className="dollarCardColumn textCenter fontBold">
                                            <span>{'прод.'}</span>
                                        </div>
                                        {kursy.map((item, index) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumn textCenter"
                                                        key={'dollar' + index}>
                                                        <span>
                                                            {item.sell} ₽
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="childrenTBlockBottom">
                            <Link className="headerTBlockBottom" href="/banner" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="indexDayNews" style={{ backgroundImage: `url(${'/images/banner/katalog.png'})` }}>
                                    </div>
                                </a>
                            </Link >
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(ctx) {

    let ip;
    const { req } = ctx;
    if (req.headers["x-forwarded-for"]) {
        ip = req.headers["x-forwarded-for"].split(',')[0]
    } else if (req.headers["x-real-ip"]) {
        ip = req.connection.remoteAddress
    } else {
        ip = req.connection.remoteAddress
    }

    //news - smi
    let reqSmi = await fetch(`${process.env.STRURL}/api/smi/posts?mainPage=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resSmi; if (reqSmi.status == 200) { resSmi = await reqSmi.json() } else { resSmi = { data: [] } }
    //social - palata
    let reqSocial = await fetch(`${process.env.STRURL}/api/social/posts?mainPage=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resSocial; if (reqSocial.status == 200) { resSocial = await reqSocial.json() } else { resSocial = { data: [] } }
    //forum
    let reqForum = await fetch(`${process.env.STRURL}/api/forum/posts?mainPage=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resForum; if (reqForum.status == 200) { resForum = await reqForum.json() } else { resForum = { data: [] } }
    //polezno - baza
    let reqPoleznoe = await fetch(`${process.env.STRURL}/api/poleznoe/posts?mainPage=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resPoleznoe; if (reqPoleznoe.status == 200) { resPoleznoe = await reqPoleznoe.json() } else { resPoleznoe = { data: [] } }

    //загрузить данные погоды
    let reqWeather = await fetch(`${process.env.STRURL}/api/weather`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resWeather; if (reqWeather.status == 200) { resWeather = await reqWeather.json() } else { resWeather = { data: [] } }
    //загрузить опрос
    let reqOpros = await fetch(`${process.env.STRURL}/api/opros?latest=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resOpros; if (reqOpros.status == 200) { resOpros = await reqOpros.json() } else { resOpros = { data: [] } }
    //загрузить ссылки якнет
    let reqYaknet = await fetch(`${process.env.STRURL}/api/yaknet?limit=4&random=true`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resYaknet; if (reqYaknet.status == 200) { resYaknet = await reqYaknet.json() } else { resYaknet = { data: [] } }
    //загрузить курсы валют
    let reqKursy = await fetch(`${process.env.STRURL}/api/kursy`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    let resKursy; if (reqKursy.status == 200) { resKursy = await reqKursy.json() } else { resKursy = { data: [] } }


    return {
        props: {
            url: process.env.STRURL,
            ip: ip,
            smi: resSmi.data,
            social: resSocial.data,
            forum: resForum.data,
            poleznoe: resPoleznoe.data,
            opros: resOpros.data,
            yaknet: resYaknet.data,
            kursy: resKursy.data,
            weather: resWeather.data,
        }
    }
}