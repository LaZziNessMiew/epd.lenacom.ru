import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import $ from "jquery";
import Link from 'next/link'
import Head from 'next/head'

export default function Forum(props) {
    const router = useRouter()
    const [tags, setTags] = useState(props.posts.data)

    const goTo = async (link) => {
        router.push(link)
    }

    return (
        <div className='globWrapper'>
            <Head>
                <title>Лена Форумы</title>
            </Head>
            <div className='forumMainWrapper'>
                <div className={tags.length == 0 ? 'forumChildContentIndex forumChildContentIndexSolo' : 'forumChildContentIndex'} >
                    {
                        tags.length == 0 ? <div className="centerText">Нет данных, проверьте подключение к интернету или зайдите позже</div> : tags.map((item, index) => {
                            return (
                                <Link key={'tags' + index} className="headerTBlockTop" href={`/forum/${item.latin}`} onClick={(e) => { e.preventDefault() }} passHref>
                                    <a>
                                        <div className="tagsBlock pointer noselect" key={item} onClick={() => { goTo(`/forum/${item.latin}`) }} >
                                            <div className="forumLogo" style={{ background: `url('/images/forum/${item.latin}.png')` }}></div>
                                            <div className="tagsBlockTitle"><span>{item.name}</span>
                                            </div>
                                        </div>
                                    </a>
                                </Link >
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}

export async function getServerSideProps(ctx) {
    let req = await fetch(`${process.env.STRURL}/api/forum/tags`, {
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