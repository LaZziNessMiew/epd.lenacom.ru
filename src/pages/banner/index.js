import React, { useEffect, useState } from 'react';
import Head from 'next/head'

export default function AdsPost(props) {
    const [banners, setBanners] = useState(props.posts.data)
    return (
        <div className='globWrapper'>
            <Head>
                <title>Лена Баннеры</title>
            </Head>
            <div className="adsMainWrapper">
                <div className="adsSubWrapper">
                    <div className={banners.length == 0 ? 'hidden' : 'adsPreWrapper'}><span>Каталог предложений (бесплатное размещение)</span></div>
                    <div className={banners.length == 0 ? 'adsDeskWrapper adsDeskWrapperSolo' : 'adsDeskWrapper'}>
                        {banners.length == 0 ?
                            <div className="centerText">Нет баннеров</div>
                            :
                            banners.map((item) => {
                                return (
                                    <div
                                        className="singleBannerCard"
                                        key={item.id}>
                                        {item.content.map((item, index) => {
                                            return (
                                                <div key={'block' + index}>
                                                    <img key={'img' + index.toString()} className="adsImg" src={`/files/normal/${item[1]}`} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(ctx) {
    let req = await fetch(`${process.env.STRURL}/api/sponsor/posts?active=true`, {
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
            url: process.env.STRURL
        }
    }
}