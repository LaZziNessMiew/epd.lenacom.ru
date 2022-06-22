import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/router";
import Link from 'next/link'
import Head from 'next/head'
//backend-cookies
import cookies from 'next-cookies'
//frontend-cookies
import Cookies from 'js-cookie';

export default function Index(props) {
    const router = useRouter();

    const [news, setNews] = useState([])
    const [media, setMedia] = useState([])
    const [forum, setForum] = useState([])
    const [social, setPalata] = useState([])
    const [kursy, setKursy] = useState(props.kursy)
    var text1 = "Ut magnam adipisci dolorem aliquam eius eius tempora.Etincidunt sit magnam dolor aliquam quiquia tempora.Tempora dolor labore tempora ut adipisci voluptatem amet."
    useEffect(() => {
        let num = 5
        const LoremIpsum = require("lorem-ipsum").LoremIpsum;
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
                max: 8,
                min: 4
            },
            wordsPerSentence: {
                max: 16,
                min: 4
            }
        });
        let data = []
        for (var i = 0; i < num; i++) {
            data.push(lorem.generateSentences(1))
        }
        setNews(data)
        data = []
        for (var i = 0; i < num; i++) {
            data.push(lorem.generateSentences(1))
        }
        setMedia(data)
        data = []
        for (var i = 0; i < num; i++) {
            data.push(lorem.generateSentences(1))
        }
        setForum(data)
        data = []
        for (var i = 0; i < num; i++) {
            data.push(lorem.generateSentences(1))
        }
        setPalata(data)
    }, [])

    const goTo = (link) => {
        router.push(link)
    }
    const questionAction = () => {
        alert("AAAAAAAAAAAAAAA")
    }

    return (
        <div className='globWrapper'>
            <Head>
                <title>Ленаком Якутск</title>
            </Head>
            <div className="mainContent">
                <div className="mainChildContent">

                    <div className="topicBlocksTop">
                        <div className="childrenTBlockTop0 childrenTBlockTop">
                            <Link className="headerTBlockTop" href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.2), rgba(0, 137, 229, 0.5)), url(${'/files/normal/1.jpg'})` }}>
                                        <div className="headerIndexDayNews">
                                            {text1.length > 105 ? text1.slice(0, 105) + "..." : text1}
                                        </div>
                                        <div className='footerIndexDayNews'>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R floatR'>{'1 мин'}</div>
                                        </div>
                                    </div>
                                </a>
                            </Link >
                        </div>
                        <div className="childrenTBlockTop1 childrenTBlockTop">
                            <Link className="headerTBlockTop" href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.2), rgba(0, 137, 229, 0.5)), url(${'/files/normal/1.jpg'})` }}>

                                        <div className="headerIndexDayNews">
                                            {text1.length > 105 ? text1.slice(0, 105) + "..." : text1}
                                        </div>
                                        <div className='footerIndexDayNews'>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R floatR'>{'1 мин'}</div>
                                        </div>
                                    </div>

                                </a>
                            </Link >
                        </div>
                        <div className="childrenTBlockTop2 childrenTBlockTop">
                            <Link className="headerTBlockTop" href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.2), rgba(0, 137, 229, 0.5)), url(${'/files/normal/1.jpg'})` }}>

                                        <div className="headerIndexDayNews">
                                            {text1.length > 105 ? text1.slice(0, 105) + "..." : text1}
                                        </div>
                                        <div className='footerIndexDayNews'>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R floatR'>{'1 мин'}</div>
                                        </div>
                                    </div>
                                </a>
                            </Link ></div>
                        <div className="childrenTBlockTop3 childrenTBlockTop">
                            <Link className="headerTBlockTop" href="/smi" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="indexDayNews" style={{ backgroundImage: `linear-gradient(to bottom, rgba(245, 246, 252, 0.2), rgba(0, 137, 229, 0.5)), url(${'/files/normal/1.jpg'})` }}>

                                        <div className="headerIndexDayNews">
                                            {text1.length > 105 ? text1.slice(0, 105) + "..." : text1}
                                        </div>
                                        <div className='footerIndexDayNews'>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-comment-alt-lines fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R'><div className='newsPostInfoChild'><i className="far fa-eye fa-sm"></i><span>{0}</span></div></div>
                                            <div className='newsPostInfo margin15R floatR'>{'1 мин'}</div>
                                        </div>
                                    </div>
                                </a>
                            </Link ></div>
                        <div className="childrenTBlockTop4 childrenTBlockTop">
                            <div className="cardTitle">
                                <span>{'Пульс'}</span>
                            </div>
                            <div className="cardContent">
                                <div className="weatherCard">
                                    <div className="weatherCardElement"><img className="weatherIcon" src={`/images/weather/cloud-sun.png`} />СЕЙЧАС</div>
                                    <div className="weatherCardElement"><img className="weatherIcon" src={`/images/weather/rain-sun.png`} />СЕГОДНЯ</div>
                                    <div className="weatherCardElement"><img className="weatherIcon" src={`/images/weather/sun.png`} />ЗАВТРА</div>
                                    <div className="weatherCardElement"><img className="weatherIcon" src={`/images/weather/sun.png`} />ПОСЛЕЗАВТРА</div>
                                </div>
                            </div>
                        </div>
                        <div className="childrenTBlockTop5 childrenTBlockTop">
                            <div className="cardTitle">
                                <span>{'Опрос'}</span>
                            </div>
                            <div className="oprosContent">
                                <span>{'Предложение один короткий опрсов одобряете ли действия Владимира Путина?'}</span>
                            </div>
                            <div className="oprosQuestion">
                                <div className="oprosQuestionStyle" onClick={(e) => { questionAction(e, 'like') }}>
                                    <span>{'Ответ 1'}</span>
                                </div>
                                <div className="oprosQuestionStyle" onClick={(e) => { questionAction(e, 'like') }}>
                                    <span>{'Ответ 2'}</span>
                                </div>
                                <div className="oprosQuestionStyle" onClick={(e) => { questionAction(e, 'like') }}>
                                    <span>{'Ответ 3'}</span>
                                </div>
                                <div className="oprosQuestionStyle" onClick={(e) => { questionAction(e, 'like') }}>
                                    <span>{'Ответ 4'}</span>
                                </div>
                                <div className="oprosQuestionStyle" onClick={(e) => { questionAction(e,) }}>
                                    <span>{'Ответ 5'}</span>
                                </div>
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
                            {news.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className="contentTBlock">
                                        {item}
                                    </div>
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
                            {social.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className="contentTBlock">
                                        {item}
                                    </div>
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
                            {forum.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className="contentTBlock">
                                        {item}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="childrenTBlock">
                            <Link className="headerTBlock" href="/stena" onClick={(e) => { e.preventDefault() }} passHref>
                                <a>
                                    <div className="headerTBlock">
                                        <span>{'База'}</span>
                                    </div>
                                </a>
                            </Link >
                            {media.map((item) => {
                                return (
                                    <div
                                        key={item}
                                        className="contentTBlock">
                                        {item}
                                    </div>
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
                                        <span>{'Местный интернет'}</span>
                                    </div>
                                </a>
                            </Link>
                            <div className="cardContent">
                                <div className="yaknetCard">
                                    <ul>
                                        <li>yakutskgo.ru</li>
                                        <li>sakha.gov.ru</li>
                                        <li>sakhamovie.ru</li>
                                        <li>sakhamusic.ru</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="childrenTBlockBottom">
                            <div className="cardTitle">
                                <span>{'Курс доллара'}</span>
                            </div>
                            <div className="cardContent">
                                <div className="dollarCard">
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Наличный'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div className="dollarCardColumn">
                                                        <span>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Покупка'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div className="dollarCardColumnChildren">
                                                        <span>
                                                            {item.buy}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Продажа'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "cash" ?
                                                    <div className="dollarCardColumnChildren">
                                                        <span>
                                                            {item.sell}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Онлайн'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumn">
                                                        <span>
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Покупка'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumnChildren">
                                                        <span>
                                                            {item.buy}
                                                        </span>
                                                    </div>
                                                    : null)
                                        })}
                                    </div>
                                    <div className="dollarCardColumn">
                                        <div className="dollarCardColumn">
                                            <span>{'Продажа'}</span>
                                        </div>
                                        {kursy.map((item) => {
                                            return (
                                                item.type == "online" ?
                                                    <div className="dollarCardColumnChildren">
                                                        <span>
                                                            {item.sell}
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
                                    <div className="indexDayNews" style={{ backgroundImage: `url(${'/files/normal/1.png'})` }}>
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
    console.log("CLIENT", ip)

    const pid = { page: 1 };
    //Найти количество всех постов
    let reqKursy = await fetch(`${process.env.STRURL}/api/kursy/kursy`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    let resKursy
    if (reqKursy.status == 200) {
        resKursy = await reqKursy.json()
    } else {
        resKursy = { data: [] }
    }

    return {
        props: {
            kursy: resKursy.data,
            url: process.env.STRURL,
        }
    }
}
{/* export async function getServerSideProps(ctx) {
    console.log("TEST", ctx.req.headers)
    return {
        props: {
        }
    }
} */}


{/* export async function getServerSideProps({ req }) {
    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    console.log("DETECTED IP:", ip)
    return {
        props: {
            ip,
        },
    }
} */}
